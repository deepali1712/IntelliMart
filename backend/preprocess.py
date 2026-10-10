import pandas as pd
import os

def clean_data():
    # Define file paths based on your data folder
    input_file = 'data/amazon.csv'
    output_file = 'data/amazon_cleaned.csv'
    
    print(f"Loading raw data from {input_file}...")
    
    # Check if file exists before trying to read it
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found. Please ensure the file is in the data folder.")
        return

    df = pd.read_csv(input_file)
    
    # 1. Clean Prices (Remove ₹ and commas, convert to float)
    print("Cleaning price columns...")
    df['discounted_price_clean'] = df['discounted_price'].str.replace('₹', '', regex=False).str.replace(',', '', regex=False).astype(float)
    df['actual_price_clean'] = df['actual_price'].str.replace('₹', '', regex=False).str.replace(',', '', regex=False).astype(float)
    
    # 2. Clean Discount Percentage
    print("Cleaning discount percentages...")
    df['discount_percentage_clean'] = df['discount_percentage'].str.replace('%', '', regex=False).astype(float)
    
    # 3. Clean Ratings (Convert to float, force errors to NaN, fill with median)
    print("Imputing missing ratings...")
    df['rating_clean'] = pd.to_numeric(df['rating'], errors='coerce')
    df['rating_clean'].fillna(df['rating_clean'].median(), inplace=True)
    
    # 4. Clean Rating Count
    df['rating_count_clean'] = df['rating_count'].str.replace(',', '', regex=False)
    df['rating_count_clean'] = pd.to_numeric(df['rating_count_clean'], errors='coerce')
    df['rating_count_clean'].fillna(df['rating_count_clean'].median(), inplace=True)
    
    # 5. Extract Primary Category
    print("Extracting primary categories...")
    df['primary_category'] = df['category'].apply(lambda x: str(x).split('|')[0] if pd.notnull(x) else '')
    
    # 6. Create Combined Text Feature for NLP Recommendation Engine
    print("Building NLP text corpus...")
    df['combined_features'] = df['product_name'].fillna('') + ' ' + df['primary_category'] + ' ' + df['about_product'].fillna('')
    
    # 7. Create Target Variable for Naïve Bayes (High vs Low Success)
    print("Generating classification targets...")
    df['sales_category'] = df['rating_clean'].apply(lambda x: 'High' if x >= 4.0 else 'Low')
    
    # Save the cleaned dataset back into the data folder
    df.to_csv(output_file, index=False)
    print(f"Data preprocessing complete. Saved as '{output_file}'.")

if __name__ == '__main__':
    clean_data()
    
    
    
    # ==========================================
# CONCLUSION: DATA PREPROCESSING (ETL) SUMMARY
# ==========================================
# 1. Extraction: Loaded raw unstructured data from 'data/amazon.csv'.
# 2. Transformation (Numerical): Stripped currency symbols (₹) and percentages (%), 
#    casting string prices and discounts into continuous float arrays.
# 3. Imputation: Handled missing values in 'rating' and 'rating_count' using 
#    median imputation to prevent mathematical errors during model training.
# 4. Feature Engineering (NLP): Extracted the primary category and concatenated it 
#    with product names and descriptions to build a rich text corpus for TF-IDF.
# 5. Target Generation: Created a binary 'sales_category' (High/Low) based on a 
#    4.0 rating threshold to serve as the target variable for Naïve Bayes classification.
# 6. Load: Exported the finalized, ML-ready dataset to 'data/amazon_cleaned.csv'.
# ==========================================