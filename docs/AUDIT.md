# IntelliMart Technical Audit & Remediation Plan

**Date:** 2026-10-12  
**Project:** IntelliMart — University Data Warehousing & Data Mining (DWM) Project  
**Author:** Antigravity Senior Full-Stack & Data Intelligence Engineer  

---

## 1. Executive Summary

IntelliMart is designed as a dual-surface application:
1. **Customer Storefront** (`/`, `/products`, `/products/:id`, `/recommendations`, `/cart`, `/about`) demonstrating modern e-commerce UX with real-time NLP recommendations and sentiment insights.
2. **Admin DWM Intelligence Center** (`/admin/*`) providing university-level DWM demonstrations: OLAP cube operations (Slice, Dice, Roll-Up, Drill-Down, Pivot), Classification (Naïve Bayes), Clustering (K-Means), Sentiment Analysis (VADER), Association Rule Mining (Apriori), Regression Analysis, and a Rating-Tier Prediction Playground.

The initial audit revealed the following primary root causes for the non-functional state:
- **Critical Port Conflict (macOS AirPlay / ControlCenter on Port 5000):** Requests to `http://localhost:5000/api` hit macOS ControlCenter's AirTunes receiver instead of Flask, returning `HTTP 403 Forbidden`.
- **Frontend Unhandled Promise Rejections:** `Promise.all` in `AdminDashboard.jsx` failed entirely when any single API call failed, keeping all states null and freezing UI cards on `"..."` and charts on `"Processing text data..."`.
- **Unimplemented Frontend Storefront:** `Storefront.jsx`, `Navbar.jsx`, `ProductCard.jsx`, `RecommendDrawer.jsx`, and `SentimentModal.jsx` were empty placeholder files (0 bytes), and `App.jsx` rendered a simple text banner.
- **Architectural Debt & Monolithic Backend:** `app.py` contained all route, data loading, and model logic without service separation; lacked health/dataset exploration endpoints; retrained models synchronously on request; and lacked a standard API response envelope `{data, meta, error}`.
- **Data Preprocessing Inconsistencies:** `preprocess.py` naively split reviews on commas (corrupting review-content alignment), hardcoded synthetic target generation without training-time isolation, and did not produce standard OLAP buckets (rating, discount, price) or hierarchical category levels.

---

## 2. Frontend Audit

- **Entry Point:** `frontend/src/main.jsx` mounts `App.jsx` onto `#root` in `index.html`.
- **Router:** `react-router-dom` v6.30.6. Only `/` (placeholder) and `/admin` (monolithic dashboard) were configured.
- **API Client:** `frontend/src/services/api.js` instantiated Axios with a hardcoded `baseURL: "http://localhost:5000/api"`. No environment variable support (`VITE_API_BASE_URL`).
- **Tailwind Version:** Tailwind CSS v3.4.0 with PostCSS and Autoprefixer.
- **Installed Packages:**
  - `axios`: ^1.20.0
  - `lucide-react`: ^0.300.0
  - `react`: ^18.2.0
  - `react-dom`: ^18.2.0
  - `react-router-dom`: ^6.30.6
  - `recharts`: ^2.15.4
  - `tailwindcss`: ^3.4.0
  - `vite`: ^5.0.8
- **Component File Status:**
  - `frontend/src/pages/Storefront.jsx`: 0 bytes (empty)
  - `frontend/src/components/Navbar.jsx`: 0 bytes (empty)
  - `frontend/src/components/ProductCard.jsx`: 0 bytes (empty)
  - `frontend/src/components/RecommendDrawer.jsx`: 0 bytes (empty)
  - `frontend/src/components/SentimentModal.jsx`: 0 bytes (empty)
  - `frontend/src/pages/AdminDashboard.jsx`: 517 lines monolithic file, lacked error/retry boundaries, lacked mobile drawer navigation, hardcoded chart color palettes, and lacked individual DWM module sub-routes.

---

## 3. Backend Audit

- **Entry Point:** `backend/app.py`
- **Default Port:** 5000 (conflicts with macOS AirPlay receiver on `0.0.0.0:5000`). Needs migration to port 5001 with environment-variable fallback.
- **CORS Configuration:** `CORS(app)` currently enables open wildcard CORS (`*`). Must restrict to `http://localhost:5173`.
- **Installed Python Packages:**
  - `Flask`: 3.0.2
  - `flask-cors`: 4.0.0
  - `pandas`: 2.2.2
  - `numpy`: 1.26.4
  - `scikit-learn`: 1.4.2
  - `nltk`: 3.8.1
  - `mlxtend`: 0.23.0
  - `scipy`: 1.12.0
- **Service Modularization:** All logic currently resides in `app.py`. Cleaning, OLAP, ML models, Recommender, and Sentiment must be separated into clean service modules under `backend/services/`.
- **Response Format:** Raw Python dictionaries/lists passed to `jsonify()`. No standardized `{data, meta, error}` envelope. `NaN` and `Infinity` from pandas calculations could result in invalid JSON.

---

## 4. Dataset Audit & Pitfall Profiling

- **Source File:** `backend/data/amazon.csv` (1,465 rows, 16 columns)
- **Engineered File:** `backend/data/amazon_cleaned.csv` (1,465 rows, 24 columns)

### Detailed Column Profile

| Column | Raw Type | Missing | Profile & Observations |
| :--- | :--- | :--- | :--- |
| `product_id` | `object` | 0 (0%) | 1,465 rows, 1,351 unique IDs (114 duplicate product IDs due to multiple scrape entries). |
| `product_name` | `object` | 0 (0%) | Full product titles. |
| `category` | `object` | 0 (0%) | Pipe-delimited hierarchy (depth: min 2, max 7, median 4). Needs parsing into `main_category`, `sub_category`, and `category_path`. |
| `discounted_price` | `object` | 0 (0%) | Formatted with `₹` and commas (e.g., `'₹1,099'`). Requires stripping and casting to float. |
| `actual_price` | `object` | 0 (0%) | Formatted with `₹` and commas (e.g., `'₹1,899'`). |
| `discount_percentage`| `object` | 0 (0%) | Formatted as string with `%` (e.g., `'64%'`). |
| `rating` | `object` | 0 (0%) | Contains 1 stray non-numeric value: `'|'` at row 1279 (`B08L12N5H1`). Coerced to median (4.2). |
| `rating_count` | `object` | 2 (0.14%) | String with commas. 2 null values imputed with median (5,179.0). |
| `about_product` | `object` | 0 (0%) | Bullet-point product description text. Used in NLP TF-IDF matrix. |
| `user_id` | `object` | 0 (0%) | Up to 8 comma-separated user IDs per row. Total 11,503 tokens, 9,050 unique users. **1,304 users reviewed > 1 product**. Enables genuine co-review Apriori basket mining! |
| `review_id` | `object` | 0 (0%) | Up to 8 comma-separated review IDs per row. |
| `review_title` | `object` | 0 (0%) | Comma-separated review titles (up to 14 tokens). |
| `review_content` | `object` | 0 (0%) | Multiple reviews per row. Contains intra-sentence commas (up to 126 comma segments). **Naive comma splitting misaligns reviews**. Product-level combined review sentiment is the honest approach. |
| `img_link` | `object` | 0 (0%) | High-res Amazon product image URLs. Some CDN images have hotlink expiration; frontend requires a reliable SVG/data fallback. |
| `product_link` | `object` | 0 (0%) | Amazon product detail URLs. |

---

## 5. Root Causes of Empty / Stuck UI Elements

1. **Port 5000 AirPlay Conflict:** `localhost:5000` responds with `403 Forbidden` from Apple AirTunes daemon, failing all Axios requests.
2. **Missing Catch/Error State in React:** `AdminDashboard.jsx` caught the network error in `console.error` and left `metrics = null`, `clusterData = []`, `sentimentData = []`, leaving the UI permanently showing `...` and loading text.
3. **Empty Components:** Customer Storefront components were 0-byte stubs.
4. **Synchronous Heavy Preprocessing:** Startup did not cleanly warm up and expose readiness status via `/api/health`.
5. **No Filter Context Synchronization:** Slicing filters did not propagate reliably across separate modules.

---

## 6. Remediation & Implementation Roadmap

- [x] **Phase 0: Audit & Port Repair:**
  - Migrate backend to port 5001.
  - Configure Vite proxy and frontend `.env` to point to port 5001.
  - Restrict dev CORS to `http://localhost:5173`.
  - Document all findings in `docs/AUDIT.md`.
- [ ] **Phase 1: Robust Data Pipeline & Architecture:**
  - Build `backend/services/cleaner.py`: robust numeric parsing, category hierarchy extraction, engineered bucket columns (`rating_bucket`, `discount_bucket`, `price_bucket`), report dropped/imputed statistics.
  - Implement warm-up cache on startup: Analytical DataFrame, TF-IDF matrix, VADER sentiment cache, pre-trained Naïve Bayes and Linear Regression models.
  - Add `/api/health` endpoint with status and readiness flags.
  - Implement JSON serialization helper (`NaN` / `Infinity` converted to `null`).
  - Standardize API response envelope `{data, meta, error}`.
- [ ] **Phase 2: Full Customer Storefront:**
  - Design system with specified tokens (navy `#101828`, brand blue `#2563EB`, etc.).
  - Navigation bar with search, category menu, cart badge, and mobile drawer.
  - Home page with Hero, real category tiles, rule-based featured products, real recommender row, and benefit strip.
  - Product Listing page with live search, filters (category, price, rating, discount), sorting, and pagination.
  - Product Details page with real fields, similar products with similarity scores, and review sentiment summary.
  - Interactive Demo Cart with add/remove/quantity/subtotal, localStorage persistence, and disclaimer.
  - Recommendations page supporting both product selection and free-text queries with top shared TF-IDF terms explanation.
- [ ] **Phase 3: Admin DWM Intelligence Center:**
  - Sub-router with modular pages: Overview, Dataset, OLAP, Classification, Clustering, Sentiment, Association Rules, Regression, Prediction Playground, Docs.
  - Real Global Filters context with badge (`Filtered: X of Y products` or `Global data`).
  - Collapsible "How this works" viva-defense panels on every analytics page.
  - OLAP Cube engine: Slice, Dice, Roll-Up, Drill-Down, Pivot with pseudo-SQL display.
  - True Apriori user co-review basket mining.
  - Rigorous Naïve Bayes classification with confusion matrix, metrics, and playground.
  - K-Means with elbow curve, silhouette score, and automated centroid z-score descriptions.
  - Linear regression with trend line, train/test split, coefficients, R², MAE, RMSE, and residual analysis.
- [ ] **Phase 4: Verification, Pytest Suite & Handover:**
  - Comprehensive Pytest suite covering cleaning, OLAP calculations vs pandas, metrics, and recommender.
  - Responsive design pass across 375px, 768px, and 1280px.
  - Verification of all states (loading, error, retry, empty).
  - Complete, professional README and viva presentation documentation.
