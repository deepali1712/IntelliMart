# IntelliMart: Data Warehousing & Data Mining (DWM) Platform

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-5-646cff.svg)](https://vitejs.dev/)
[![Flask 3.0](https://img.shields.io/badge/flask-3.0-black.svg)](https://flask.palletsprojects.com/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.4-38bdf8.svg)](https://tailwindcss.com/)

A full-stack e-commerce catalog and academic analytical workstation built for university **Data Warehousing & Data Mining (DWM)** course evaluations, viva defenses, and technical demonstrations.

---

## ⚡ How to Run the Project (Step-by-Step)

### Prerequisites
- **Python 3.10+** (with `pip`)
- **Node.js 18+** (with `npm`)

---

### Step 1: Start the Backend (Flask API)

Open **Terminal 1** and run:

```bash
cd backend
python3 app.py
```

> **macOS Port Note:** On macOS Monterey / Ventura / Sonoma / Sequoia, port 5000 is reserved by Apple AirPlay Receiver (`ControlCenter`). IntelliMart's Flask server runs on **Port 5001** (`http://127.0.0.1:5001`) with automatic CORS authorization for the Vite frontend (`http://localhost:5173`).

You should see:
```text
==> Initializing IntelliMart Data Warehouse Pipeline...
Loaded and cleaned 1465 records.
Warming up OLAP engine...
Warming up Machine Learning models (Naïve Bayes, K-Means, Regression)...
Warming up VADER Sentiment Analyzer...
Mining co-review reviewer baskets for Apriori...
Building TF-IDF Recommender index...
==> IntelliMart Data & Analytics Engine READY!
Starting IntelliMart API on http://0.0.0.0:5001...
```

Verify backend health in browser or curl:
```bash
curl http://localhost:5001/api/health
```

---

### Step 2: Start the Frontend (React + Vite)

Open **Terminal 2** and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at:
👉 **Customer Storefront:** `http://localhost:5173/`  
👉 **Admin DWM Intelligence Center:** `http://localhost:5173/admin`

---

## 🏗️ System Architecture & Data Pipeline

```
Raw CSV (`data/amazon.csv`) — 1,465 rows, 16 attributes
      │
      ▼
ETL Cleaning & Imputation (`backend/services/cleaner.py`)
  • Strips currency symbols (₹) and percentages (%)
  • Coerces non-numeric ratings (e.g. '|' at row 1279) to median (4.2)
  • Imputes missing rating counts (median = 5,179)
  • Extracts 3 category hierarchy levels (main, sub, leaf)
  • Engineers 3 ordinal OLAP buckets (rating, discount, price)
  • Zero rows silently dropped (100% data retention)
      │
      ▼
Cached In-Memory Analytical DataFrame (`data/amazon_cleaned.csv`)
      │
      ├─── OLAP Cube Service (`olap_service.py`)
      │      └── Slice, Dice, Roll-Up, Drill-Down, 2D Pivot & Heatmaps with pseudo-SQL
      │
      ├─── Machine Learning Service (`ml_service.py`)
      │      ├── Gaussian Naïve Bayes Classification (Rating Tier ≥ 4.2)
      │      ├── K-Means Clustering (Standardized features, Elbow, Centroid Z-scores)
      │      └── Linear Regression (Review Volume proxy log1p vs Discount)
      │
      ├─── NLP Sentiment Service (`sentiment_service.py`)
      │      └── VADER rule-based lexicon scoring on product-level combined reviews
      │
      ├─── Association Mining Service (`association_service.py`)
      │      └── Apriori frequent itemsets on 1,304 multi-product reviewer baskets
      │
      └─── Content-Based Recommender (`recommender_service.py`)
             └── 5,000-feature TF-IDF matrix + Cosine Similarity with explainable shared terms
      │
      ▼
Thin REST Blueprints (`backend/routes/*.py`)
      │  Standard envelope: { "data": ..., "meta": ..., "error": null }
      ▼
React 18 Frontend Client (`http://localhost:5173`)
```

---

## 🧭 Navigation & Page Directory

### 🛍️ Customer Storefront
| Route | Purpose | Key Features |
| :--- | :--- | :--- |
| `/` | **Home Page** | Hero banner, real category tiles, verified rule-based featured products (★ ≥ 4.3), discount deals, benefits strip. |
| `/products` | **Product Catalog** | Live keyword search, multi-filter sidebar (category, rating, discount, price cap), sorting, server-side pagination. |
| `/products/:id` | **Product Details** | Full specs, price in ₹, about_product list, real VADER review sentiment breakdown, similar products. |
| `/recommendations` | **Smart Recommender** | Content-based recommendations by seed product or free-text query with similarity score % and shared keyword reasons. |
| `/cart` | **Demo Cart** | Persistent in `localStorage`, quantity increment/decrement, subtotal calculation, demo disclaimer. |
| `/about` | **About & Methodology** | Project background, ETL transformations table, academic honesty contract. |

### 📊 Admin DWM Intelligence Center
| Route | Purpose | Key Features |
| :--- | :--- | :--- |
| `/admin` | **Overview** | KPI metric cards (1,465 products, 9 categories, ★4.1 avg), model readiness matrix, empirical data insights. |
| `/admin/dataset` | **Dataset Explorer** | Column schemas, null counts, numeric statistics, category distribution bar chart, field-to-model lineage, CSV download. |
| `/admin/olap` | **OLAP Operations** | Interactive Slice, Dice, Roll-Up, Drill-Down, and 2D Pivot Table with normalized intensity heatmap and ANSI pseudo-SQL display. |
| `/admin/classification` | **Naïve Bayes** | Accuracy, Precision, Recall, F1, majority baseline comparison, confusion matrix heatmap, per-class report. |
| `/admin/clustering` | **K-Means** | K slider (2-8), feature selection, inertia elbow curve, silhouette score, scatter plot, automated centroid z-score summaries. |
| `/admin/sentiment` | **VADER Sentiment** | Positive/Neutral/Negative donut chart, category breakdown, compound score histogram, searchable product table. |
| `/admin/association-rules` | **Apriori Mining** | Real reviewer baskets (sub-category & product level), support-vs-confidence scatter, lift distribution, rules table. |
| `/admin/regression` | **Linear Regression** | Target log1p(rating_count), coefficients, R², MAE, RMSE, empirical trend curve, residual diagnostics, correlation vs causation. |
| `/admin/prediction` | **Prediction Playground** | Simulate pricing & discounts to predict customer rating tier (≥ 4.2) with posterior class probabilities. |
| `/admin/docs` | **Viva Guide & Docs** | Comprehensive external examiner defense FAQ, data dictionary, and architectural rationale. |

---

## 🎯 Academic Honesty Contract & Viva Defense Notes

1. **No Fake Metrics:** Every percentage, count, and chart on screen is computed dynamically from real dataset operations or trained scikit-learn models.
2. **Co-Review Associations vs. Purchase Data:** The dataset contains customer reviews (`user_id`), not transactional sales receipts. Apriori rules are accurately labeled as **Co-Review Associations** (cross-product reviewer evaluation affinity) rather than retail purchases.
3. **Rating-Tier Target (No Data Leakage):** The Naïve Bayes model predicts `rating_tier` (≥ 4.2), not sales velocity. Rating features are strictly excluded from the feature space during training, and all scaling is fit on the training split only.
4. **Modest Linear Regression R² (~0.09):** We report low R² honestly. Discount depth alone is weakly correlated with review volume. In real e-commerce, review volume is heavily driven by brand marketing budget, product age, and category necessity.
5. **Product-Level VADER Sentiment:** Multi-review content rows with internal commas are evaluated at the product level rather than naively splitting on commas, which would corrupt sentence structure.

---

## 🧪 Testing & Verification

Run the automated Pytest suite in `backend`:

```bash
cd backend
pytest -v tests/
```

Test coverage includes:
- **`test_cleaner.py`**: Validates numeric parsing of prices, discounts, ratings, bucket generation, and absence of NaN values.
- **`test_olap.py`**: Compares Slice, Roll-Up, and Pivot outputs directly against manual pandas calculations.
- **`test_models.py`**: Asserts absence of target leakage in Naïve Bayes, verifies recommender strictly excludes the query item, and validates VADER output bounds.
- **`test_api.py`**: Validates health checks, pagination, 404 error envelopes, and OLAP API endpoints.

To verify frontend build:
```bash
cd frontend
npm run build
```

---

## 🔒 Security Notice

This application is engineered for **local academic and demonstration use**:
- **CORS** is restricted to local Vite dev origins (`http://localhost:5173`, `http://127.0.0.1:5173`).
- All OLAP inputs are strictly validated against allowlists; no raw SQL or user expressions are evaluated.
- No sensitive user credentials or payment credentials are collected or processed.
