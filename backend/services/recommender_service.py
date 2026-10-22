import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class RecommenderService:
    def __init__(self, df):
        self.df = df
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=5000,
            ngram_range=(1, 2)
        )
        # Corpus concatenation
        text_corpus = (
            df['product_name'].fillna('') + ' ' +
            df['main_category'].fillna('') + ' ' +
            df['sub_category'].fillna('') + ' ' +
            df['about_product'].fillna('')
        )
        self.tfidf_matrix = self.vectorizer.fit_transform(text_corpus)
        self.feature_names = np.array(self.vectorizer.get_feature_names_out())
        # Index map
        self.id_to_idx = {pid: idx for idx, pid in enumerate(df['product_id'])}

    def get_shared_terms(self, idx1, idx2, top_n=3):
        """Finds top shared TF-IDF keywords between two items for explainability."""
        v1 = self.tfidf_matrix[idx1].toarray().flatten()
        v2 = self.tfidf_matrix[idx2].toarray().flatten()
        shared_product = v1 * v2
        nonzero_indices = np.where(shared_product > 0)[0]
        if len(nonzero_indices) == 0:
            return ["category attributes", "similar usage"]
        top_sub_idx = nonzero_indices[np.argsort(shared_product[nonzero_indices])[-top_n:][::-1]]
        return [str(self.feature_names[i]) for i in top_sub_idx]

    def recommend_for_product(self, product_id, top_k=5):
        if product_id not in self.id_to_idx:
            return None

        idx = self.id_to_idx[product_id]
        query_vec = self.tfidf_matrix[idx]
        sims = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        # Sort indices by similarity descending
        sorted_indices = np.argsort(sims)[::-1]
        query_item = self.df.iloc[idx]
        query_name = str(query_item['product_name'])

        recommendations = []
        seen_ids = {str(product_id)}
        seen_names = {query_name.lower().strip()}

        for i in sorted_indices:
            # Exclude query item index itself
            if i == idx:
                continue
            item = self.df.iloc[i]
            item_id = str(item['product_id'])
            item_name = str(item['product_name']).lower().strip()

            # Strictly exclude identical product_id and identical product_name
            if item_id in seen_ids or item_name in seen_names:
                continue

            seen_ids.add(item_id)
            seen_names.add(item_name)
            # Avoid duplicate product names if any
            score = float(sims[i])
            shared_terms = self.get_shared_terms(idx, i)
            reason = f"Shared keywords: {', '.join(shared_terms)}" if shared_terms else "Semantically similar features"

            recommendations.append({
                "product_id": str(item['product_id']),
                "product_name": str(item['product_name']),
                "main_category": str(item['main_category']),
                "sub_category": str(item['sub_category']),
                "discounted_price": float(item['discounted_price_clean']),
                "actual_price": float(item['actual_price_clean']),
                "discount_percentage": float(item['discount_percentage_clean']),
                "rating": float(item['rating_clean']),
                "rating_count": int(item['rating_count_clean']),
                "img_link": str(item['img_link']),
                "similarity_score": round(score * 100, 1),
                "reason": reason,
                "shared_terms": shared_terms
            })

            if len(recommendations) >= top_k:
                break

        return recommendations

    def recommend_for_text(self, query_text, top_k=5):
        if not query_text or not query_text.strip():
            return []

        query_vec = self.vectorizer.transform([query_text])
        sims = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        sorted_indices = np.argsort(sims)[::-1]

        recommendations = []
        for i in sorted_indices[:top_k]:
            item = self.df.iloc[i]
            score = float(sims[i])
            recommendations.append({
                "product_id": str(item['product_id']),
                "product_name": str(item['product_name']),
                "main_category": str(item['main_category']),
                "sub_category": str(item['sub_category']),
                "discounted_price": float(item['discounted_price_clean']),
                "actual_price": float(item['actual_price_clean']),
                "discount_percentage": float(item['discount_percentage_clean']),
                "rating": float(item['rating_clean']),
                "rating_count": int(item['rating_count_clean']),
                "img_link": str(item['img_link']),
                "similarity_score": round(score * 100, 1),
                "reason": f"Matches search keywords in product title and description"
            })
        return recommendations
