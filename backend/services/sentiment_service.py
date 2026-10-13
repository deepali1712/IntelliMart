import pandas as pd
import numpy as np
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

class SentimentService:
    def __init__(self, df):
        self.df = df
        try:
            nltk.data.find('sentiment/vader_lexicon.zip')
        except LookupError:
            try:
                nltk.download('vader_lexicon', quiet=True)
            except Exception:
                pass

        self.sia = SentimentIntensityAnalyzer()
        self.cache = self._compute_all()

    def _compute_all(self):
        records = []
        scores = []
        pos_count, neu_count, neg_count = 0, 0, 0

        for _, row in self.df.iterrows():
            review_text = str(row['review_content']) if pd.notnull(row['review_content']) else ''
            title_text = str(row['review_title']) if pd.notnull(row['review_title']) else ''
            combined = f"{title_text} {review_text}".strip()

            if not combined or combined == 'nan':
                compound = 0.0
                label = 'Neutral'
                neu_count += 1
            else:
                score = self.sia.polarity_scores(combined)
                compound = round(score['compound'], 4)
                if compound >= 0.05:
                    label = 'Positive'
                    pos_count += 1
                elif compound <= -0.05:
                    label = 'Negative'
                    neg_count += 1
                else:
                    label = 'Neutral'
                    neu_count += 1

            records.append({
                "product_id": str(row['product_id']),
                "product_name": str(row['product_name']),
                "main_category": str(row['main_category']),
                "compound_score": compound,
                "sentiment": label,
                "sample_review_title": title_text[:100] if title_text else "No title",
            })
            scores.append(compound)

        total = len(records) or 1
        sentiment_summary = {
            "total_products": len(records),
            "text_coverage_pct": round((len([r for r in records if r['sample_review_title'] != 'No title']) / total) * 100, 1),
            "overall": {
                "positive": pos_count,
                "neutral": neu_count,
                "negative": neg_count,
                "positive_pct": round((pos_count / total) * 100, 1),
                "neutral_pct": round((neu_count / total) * 100, 1),
                "negative_pct": round((neg_count / total) * 100, 1),
            },
            "records": records
        }
        return sentiment_summary

    def get_summary(self, category=None):
        records = self.cache["records"]
        if category and category != "All":
            records = [r for r in records if r["main_category"] == category]

        total = len(records) or 1
        pos = sum(1 for r in records if r["sentiment"] == "Positive")
        neu = sum(1 for r in records if r["sentiment"] == "Neutral")
        neg = sum(1 for r in records if r["sentiment"] == "Negative")

        # Category breakdown
        cat_map = {}
        for r in records:
            cat = r["main_category"]
            if cat not in cat_map:
                cat_map[cat] = {"category": cat, "Positive": 0, "Neutral": 0, "Negative": 0, "total": 0}
            cat_map[cat][r["sentiment"]] += 1
            cat_map[cat]["total"] += 1

        category_breakdown = list(cat_map.values())
        for c in category_breakdown:
            t = c["total"] or 1
            c["pos_pct"] = round((c["Positive"] / t) * 100, 1)

        # Histogram bins [-1, -0.6], [-0.6, -0.2], [-0.2, 0.2], [0.2, 0.6], [0.6, 1.0]
        hist_bins = [
            {"range": "Very Negative (-1.0 to -0.6)", "count": 0},
            {"range": "Slightly Negative (-0.6 to -0.05)", "count": 0},
            {"range": "Neutral (-0.05 to +0.05)", "count": 0},
            {"range": "Slightly Positive (+0.05 to +0.6)", "count": 0},
            {"range": "Very Positive (+0.6 to +1.0)", "count": 0},
        ]
        for r in records:
            sc = r["compound_score"]
            if sc < -0.6:
                hist_bins[0]["count"] += 1
            elif sc < -0.05:
                hist_bins[1]["count"] += 1
            elif sc <= 0.05:
                hist_bins[2]["count"] += 1
            elif sc <= 0.6:
                hist_bins[3]["count"] += 1
            else:
                hist_bins[4]["count"] += 1

        donut_data = [
            {"name": "Positive", "value": round((pos / total) * 100, 1), "count": pos, "color": "#16A34A"},
            {"name": "Neutral", "value": round((neu / total) * 100, 1), "count": neu, "color": "#64748B"},
            {"name": "Negative", "value": round((neg / total) * 100, 1), "count": neg, "color": "#DC2626"},
        ]

        return {
            "total_analyzed": len(records),
            "distribution": donut_data,
            "category_breakdown": category_breakdown,
            "histogram": hist_bins,
            "products": records[:100]
        }

    def get_product_sentiment(self, product_id):
        matching = [r for r in self.cache["records"] if r["product_id"] == product_id]
        if not matching:
            return None
        rec = matching[0]
        # Detail on product's text
        row = self.df[self.df['product_id'] == product_id].iloc[0]
        text = str(row['review_content']) if pd.notnull(row['review_content']) else ''
        title = str(row['review_title']) if pd.notnull(row['review_title']) else ''
        scores = self.sia.polarity_scores(f"{title} {text}")
        return {
            "product_id": product_id,
            "sentiment": rec["sentiment"],
            "compound": rec["compound_score"],
            "pos": scores["pos"],
            "neu": scores["neu"],
            "neg": scores["neg"],
            "review_snippet": text[:300] + ("..." if len(text) > 300 else "")
        }
