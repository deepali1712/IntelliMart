# IntelliMart: Advanced Data Warehousing & Mining (DWM) Analytics Platform

A professional-grade, full-stack analytical workstation and admin dashboard built to demonstrate real-world **Data Warehousing, Online Analytical Processing (OLAP), and Machine Learning (Data Mining)** implementations using a cleaned e-commerce dataset (`amazon_cleaned.csv`).

---

## 🚀 Key Features & DWM Modules

### 1. Advanced OLAP Cube Operations

- **Slicing**: Filter the entire data warehouse dynamically along a single category dimension.
- **Dicing**: Multi-dimensional filtering combining category dimensions, minimum ratings, and discount depths.
- **Roll-Up**: Aggregating granular item-level records into high-level department summaries (averaging prices, ratings, and counting totals).
- **Pivot / Rotate**: Cross-tabulating dimensions to analyze relationships between product categories and performance brackets.

### 2. Implemented Machine Learning & Mining Models

- **Naïve Bayes Classification**: Evaluates feature metrics (Accuracy, Precision, Recall, F1-Score) and powers an interactive **Success Predictor** tool that forecasts sales categories based on price and discount inputs.
- **K-Means Clustering**: Performs market segmentation by clustering products based on discount depth versus ratings.
- **VADER Sentiment Analysis**: Natural Language Processing (NLP) tool analyzing customer reviews to generate Positive, Neutral, and Negative emotional distributions.
- **Apriori Algorithm**: Mines frequent itemset baskets to extract cross-selling association rules accompanied by support and confidence confidence metrics.
- **Linear Regression**: Evaluates market trends and correlations between discount depth and customer review/sales volume.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Recharts, Lucide Icons, Axios.
- **Backend**: Python, Flask, Flask-CORS.
- **Data Processing & ML**: Pandas, NumPy, Scikit-Learn, NLTK (VADER), Mlxtend.

---

## ⚙️ Setup & Installation Instructions

### Prerequisites

- Python 3.10+ installed
- Node.js & npm installed

### 1. Backend Setup (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```
