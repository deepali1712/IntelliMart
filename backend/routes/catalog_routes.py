import numpy as np
from flask import Blueprint, request
from utils.response_helper import api_response, error_response
from services.data_manager import DataManager

catalog_bp = Blueprint('catalog', __name__)

@catalog_bp.route('/api/products', methods=['GET'])
def get_products():
    dm = DataManager.get_instance()
    if not dm.ready:
        return error_response("Catalog service starting up", status=503)

    df = dm.df.copy()

    # Filters
    category = request.args.get('category', 'All')
    sub_category = request.args.get('sub_category', None)
    search = request.args.get('search', None)
    min_rating = request.args.get('min_rating', None, type=float)
    min_discount = request.args.get('min_discount', None, type=float)
    min_price = request.args.get('min_price', None, type=float)
    max_price = request.args.get('max_price', None, type=float)
    rating_bucket = request.args.get('rating_bucket', None)
    discount_bucket = request.args.get('discount_bucket', None)
    price_bucket = request.args.get('price_bucket', None)

    # Sorting
    sort = request.args.get('sort', 'relevance') # relevance, price_asc, price_desc, rating, discount
    page = request.args.get('page', 1, type=int)
    per_page = min(100, request.args.get('per_page', 24, type=int))

    # Apply filters
    if category and category != 'All':
        df = df[df['main_category'] == category]
    if sub_category and sub_category != 'All':
        df = df[df['sub_category'] == sub_category]
    if rating_bucket:
        df = df[df['rating_bucket'] == rating_bucket]
    if discount_bucket:
        df = df[df['discount_bucket'] == discount_bucket]
    if price_bucket:
        df = df[df['price_bucket'] == price_bucket]

    if min_rating:
        df = df[df['rating_clean'] >= min_rating]
    if min_discount:
        df = df[df['discount_percentage_clean'] >= min_discount]
    if min_price:
        df = df[df['discounted_price_clean'] >= min_price]
    if max_price:
        df = df[df['discounted_price_clean'] <= max_price]

    if search and search.strip():
        s = search.strip().lower()
        df = df[
            df['product_name'].str.lower().str.contains(s, na=False) |
            df['main_category'].str.lower().str.contains(s, na=False) |
            df['sub_category'].str.lower().str.contains(s, na=False) |
            df['about_product'].str.lower().str.contains(s, na=False)
        ]

    # Apply Sorting
    if sort == 'price_asc':
        df = df.sort_values(by='discounted_price_clean', ascending=True)
    elif sort == 'price_desc':
        df = df.sort_values(by='discounted_price_clean', ascending=False)
    elif sort == 'rating':
        df = df.sort_values(by='rating_clean', ascending=False)
    elif sort == 'discount':
        df = df.sort_values(by='discount_percentage_clean', ascending=False)

    total_count = len(df)
    start = (page - 1) * per_page
    end = start + per_page
    paged_df = df.iloc[start:end]

    cols = [
        'product_id', 'product_name', 'main_category', 'sub_category',
        'discounted_price_clean', 'actual_price_clean', 'discount_percentage_clean',
        'rating_clean', 'rating_count_clean', 'img_link', 'product_link',
        'rating_bucket', 'discount_bucket', 'price_bucket'
    ]
    records = paged_df[cols].to_dict(orient='records')

    # Normalize keys for frontend
    for r in records:
        r['discounted_price'] = r['discounted_price_clean']
        r['actual_price'] = r['actual_price_clean']
        r['discount_percentage'] = r['discount_percentage_clean']
        r['rating'] = r['rating_clean']
        r['rating_count'] = r['rating_count_clean']
        r['primary_category'] = r['main_category']

    unique_categories = sorted(dm.df['main_category'].unique().tolist())

    # Return standard envelope while maintaining backward compatibility format
    return api_response(
        data={
            "products": records,
            "categories": unique_categories,
        },
        meta={
            "total": total_count,
            "page": page,
            "per_page": per_page,
            "total_pages": int(np.ceil(total_count / per_page)) if total_count > 0 else 1,
            "catalog_total": len(dm.df)
        }
    )

@catalog_bp.route('/api/products/<product_id>', methods=['GET'])
def get_product_details(product_id):
    dm = DataManager.get_instance()
    if not dm.ready:
        return error_response("Catalog service starting up", status=503)

    match = dm.df[dm.df['product_id'] == product_id]
    if match.empty:
        return error_response(f"Product ID '{product_id}' not found", status=404)

    row = match.iloc[0]
    product_dict = {
        "product_id": str(row['product_id']),
        "product_name": str(row['product_name']),
        "category": str(row['category']),
        "main_category": str(row['main_category']),
        "sub_category": str(row['sub_category']),
        "leaf_category": str(row['leaf_category']),
        "discounted_price": float(row['discounted_price_clean']),
        "actual_price": float(row['actual_price_clean']),
        "discount_percentage": float(row['discount_percentage_clean']),
        "rating": float(row['rating_clean']),
        "rating_count": int(row['rating_count_clean']),
        "about_product": str(row['about_product']),
        "img_link": str(row['img_link']),
        "product_link": str(row['product_link']),
        "rating_bucket": str(row['rating_bucket']),
        "discount_bucket": str(row['discount_bucket']),
        "price_bucket": str(row['price_bucket']),
    }

    # Include sentiment summary if available
    sentiment_data = dm.sentiment_service.get_product_sentiment(product_id)
    product_dict["sentiment"] = sentiment_data

    # Include similar products
    similar = dm.recommender_service.recommend_for_product(product_id, top_k=4)
    product_dict["similar_products"] = similar

    return api_response(data=product_dict)

@catalog_bp.route('/api/categories', methods=['GET'])
def get_categories():
    dm = DataManager.get_instance()
    if not dm.ready:
        return error_response("Catalog service starting up", status=503)

    df = dm.df
    cat_summary = df.groupby('main_category').agg({
        'product_id': 'count',
        'rating_clean': 'mean',
        'discount_percentage_clean': 'mean',
        'discounted_price_clean': 'mean'
    }).reset_index()

    categories = []
    for _, r in cat_summary.iterrows():
        categories.append({
            "name": str(r['main_category']),
            "product_count": int(r['product_id']),
            "avg_rating": round(float(r['rating_clean']), 2),
            "avg_discount": round(float(r['discount_percentage_clean']), 1),
            "avg_price": round(float(r['discounted_price_clean']), 2)
        })

    categories.sort(key=lambda x: x["product_count"], reverse=True)
    return api_response(data=categories)
