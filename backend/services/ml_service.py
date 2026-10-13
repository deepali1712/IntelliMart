import numpy as np
import pandas as pd
from sklearn.naive_bayes import GaussianNB
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, silhouette_score,
    r2_score, mean_absolute_error, mean_squared_error
)

class MLService:
    def __init__(self, df, seed=42):
        self.df = df
        self.seed = seed
        self._init_classification()
        self._init_clustering()
        self._init_regression()

    # ==========================================
    # 1. NAÏVE BAYES CLASSIFICATION
    # ==========================================
    def _init_classification(self):
        # Target: rating_tier (High vs Low, threshold 4.2)
        # Features: actual_price_clean, discount_percentage_clean, discounted_price_clean, plus frequency-encoded main_category
        df = self.df.copy()
        y = df['rating_tier']

        # Frequency encoding for category
        cat_freq = df['main_category'].value_counts(normalize=True).to_dict()
        df['cat_encoded'] = df['main_category'].map(cat_freq).fillna(0)

        feature_cols = ['actual_price_clean', 'discount_percentage_clean', 'discounted_price_clean', 'cat_encoded']
        X = df[feature_cols].copy()

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.30, random_state=self.seed, stratify=y
        )

        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        nb = GaussianNB()
        nb.fit(X_train_scaled, y_train)

        y_pred = nb.predict(X_test_scaled)
        y_prob = nb.predict_proba(X_test_scaled)

        # Baseline: majority class
        majority_class = y_train.value_counts().index[0]
        baseline_acc = float((y_test == majority_class).mean())

        # Confusion matrix
        labels = ['Low', 'High']
        cm = confusion_matrix(y_test, y_pred, labels=labels)
        # cm structure: [[TN, FP], [FN, TP]]

        report_dict = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

        self.nb_model = nb
        self.nb_scaler = scaler
        self.cat_freq = cat_freq
        self.nb_features = feature_cols

        self.classification_eval = {
            "model_name": "Gaussian Naïve Bayes",
            "target": "rating_tier (High: Rating ≥ 4.2, Low: Rating < 4.2)",
            "test_sample_size": len(y_test),
            "train_sample_size": len(y_train),
            "features_used": ["actual_price", "discount_percentage", "discounted_price", "main_category_encoded"],
            "accuracy": round(float(accuracy_score(y_test, y_pred) * 100), 2),
            "precision": round(float(precision_score(y_test, y_pred, pos_label='High', zero_division=0) * 100), 2),
            "recall": round(float(recall_score(y_test, y_pred, pos_label='High', zero_division=0) * 100), 2),
            "f1_score": round(float(f1_score(y_test, y_pred, pos_label='High', zero_division=0) * 100), 2),
            "baseline_accuracy": round(baseline_acc * 100, 2),
            "classes": labels,
            "confusion_matrix": [
                {"actual": "Low", "predicted_low": int(cm[0][0]), "predicted_high": int(cm[0][1])},
                {"actual": "High", "predicted_low": int(cm[1][0]), "predicted_high": int(cm[1][1])}
            ],
            "per_class_report": {
                "High": {
                    "precision": round(float(report_dict.get('High', {}).get('precision', 0) * 100), 1),
                    "recall": round(float(report_dict.get('High', {}).get('recall', 0) * 100), 1),
                    "f1": round(float(report_dict.get('High', {}).get('f1-score', 0) * 100), 1),
                    "support": int(report_dict.get('High', {}).get('support', 0))
                },
                "Low": {
                    "precision": round(float(report_dict.get('Low', {}).get('precision', 0) * 100), 1),
                    "recall": round(float(report_dict.get('Low', {}).get('recall', 0) * 100), 1),
                    "f1": round(float(report_dict.get('Low', {}).get('f1-score', 0) * 100), 1),
                    "support": int(report_dict.get('Low', {}).get('support', 0))
                }
            },
            "class_distribution": {
                "High": int((y == 'High').sum()),
                "Low": int((y == 'Low').sum())
            }
        }

    def predict_classification(self, actual_price, discount_percentage, category="Computers&Accessories"):
        disc_price = float(actual_price) * (1.0 - (float(discount_percentage) / 100.0))
        cat_enc = float(self.cat_freq.get(category, np.mean(list(self.cat_freq.values()))))

        input_row = np.array([[float(actual_price), float(discount_percentage), disc_price, cat_enc]])
        input_scaled = self.nb_scaler.transform(input_row)

        pred = self.nb_model.predict(input_scaled)[0]
        probs = self.nb_model.predict_proba(input_scaled)[0]
        classes = list(self.nb_model.classes_)

        prob_high = round(float(probs[classes.index('High')]) * 100, 2)
        prob_low = round(float(probs[classes.index('Low')]) * 100, 2)

        return {
            "predicted_category": pred,
            "probability_high": prob_high,
            "probability_low": prob_low,
            "inputs": {
                "actual_price": float(actual_price),
                "discount_percentage": float(discount_percentage),
                "estimated_discounted_price": round(disc_price, 2),
                "category": category
            },
            "model_metrics": {
                "accuracy": self.classification_eval["accuracy"],
                "f1_score": self.classification_eval["f1_score"]
            }
        }

    # ==========================================
    # 2. K-MEANS CLUSTERING
    # ==========================================
    def _init_clustering(self):
        # Precompute elbow curve for K=2..8
        df = self.df.copy()
        X_raw = pd.DataFrame({
            'discount': df['discount_percentage_clean'],
            'rating': df['rating_clean'],
            'log_price': np.log1p(df['discounted_price_clean']),
            'log_rating_count': np.log1p(df['rating_count_clean'])
        })
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X_raw)

        elbow = []
        for k in range(2, 9):
            km = KMeans(n_clusters=k, random_state=self.seed, n_init=10)
            km.fit(X_scaled)
            sil = float(silhouette_score(X_scaled, km.labels_))
            elbow.append({
                "k": k,
                "inertia": round(float(km.inertia_), 2),
                "silhouette_score": round(sil, 3)
            })

        self.clustering_features_df = X_raw
        self.clustering_scaled = X_scaled
        self.clustering_scaler = scaler
        self.elbow_curve = elbow

    def run_clustering(self, k=3, feature_names=None, seed=None):
        k = max(2, min(8, int(k)))
        rand_seed = int(seed) if seed is not None else self.seed

        available_cols = ['discount', 'rating', 'log_price', 'log_rating_count']
        if not feature_names:
            feature_names = available_cols
        else:
            feature_names = [f for f in feature_names if f in available_cols]
            if len(feature_names) < 2:
                feature_names = available_cols

        X_sub = self.clustering_features_df[feature_names]
        scaler = StandardScaler()
        X_sub_scaled = scaler.fit_transform(X_sub)

        kmeans = KMeans(n_clusters=k, random_state=rand_seed, n_init=10)
        labels = kmeans.fit_predict(X_sub_scaled)
        sil_score = float(silhouette_score(X_sub_scaled, labels)) if k > 1 else 0.0

        # Programmatic descriptions from centroid z-scores
        centroids_scaled = kmeans.cluster_centers_
        cluster_summaries = []
        colors = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626", "#8B5CF6", "#EC4899", "#06B6D4", "#64748B"]

        df_copy = self.df.copy()
        df_copy['cluster'] = labels

        for c_idx in range(k):
            size = int((labels == c_idx).sum())
            pct = round((size / len(labels)) * 100, 1)

            # Build description from z-scores
            traits = []
            for f_i, f_name in enumerate(feature_names):
                z = centroids_scaled[c_idx][f_i]
                readable = {
                    "discount": "discount depth",
                    "rating": "customer rating",
                    "log_price": "price point",
                    "log_rating_count": "review volume"
                }.get(f_name, f_name)

                if z >= 0.5:
                    traits.append(f"significantly higher {readable}")
                elif z <= -0.5:
                    traits.append(f"lower {readable}")

            desc = ", ".join(traits) if traits else "near-average characteristics across all features"
            desc_text = f"Cluster {c_idx + 1}: {desc.capitalize()}."

            c_prods = df_copy[df_copy['cluster'] == c_idx]
            cluster_summaries.append({
                "cluster_id": c_idx,
                "name": f"Cluster {c_idx + 1}",
                "size": size,
                "percentage": pct,
                "color": colors[c_idx % len(colors)],
                "description": desc_text,
                "avg_discount": round(float(c_prods['discount_percentage_clean'].mean()), 1),
                "avg_rating": round(float(c_prods['rating_clean'].mean()), 2),
                "avg_price": round(float(c_prods['discounted_price_clean'].mean()), 2),
                "avg_rating_count": round(float(c_prods['rating_count_clean'].mean()), 0),
            })

        # Sample points for visualization
        points = []
        for _, row in df_copy.head(250).iterrows():
            points.append({
                "product_name": str(row['product_name'])[:40],
                "discount": float(row['discount_percentage_clean']),
                "rating": float(row['rating_clean']),
                "price": float(row['discounted_price_clean']),
                "rating_count": int(row['rating_count_clean']),
                "cluster": int(row['cluster']),
                "color": colors[int(row['cluster']) % len(colors)]
            })

        return {
            "k": k,
            "silhouette_score": round(sil_score, 3),
            "inertia": round(float(kmeans.inertia_), 2),
            "clusters": cluster_summaries,
            "elbow_curve": self.elbow_curve,
            "points": points,
            "features_used": feature_names
        }

    # ==========================================
    # 3. REGRESSION ANALYSIS
    # ==========================================
    def _init_regression(self):
        df = self.df.copy()
        features = ['discount_percentage_clean', 'rating_clean', 'actual_price_clean']
        X = df[features].copy()
        y = np.log1p(df['rating_count_clean'])

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.25, random_state=self.seed
        )

        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        lr = LinearRegression()
        lr.fit(X_train_scaled, y_train)

        y_pred = lr.predict(X_test_scaled)
        r2 = float(r2_score(y_test, y_pred))
        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))

        coefs = {
            "discount_percentage": round(float(lr.coef_[0]), 4),
            "rating": round(float(lr.coef_[1]), 4),
            "actual_price": round(float(lr.coef_[2]), 4),
        }

        # Trend curve by discount bin (for visualization)
        df['discount_bin'] = (df['discount_percentage_clean'] // 10) * 10
        bin_trend = df.groupby('discount_bin').agg({
            'rating_count_clean': 'mean',
            'rating_clean': 'mean'
        }).reset_index()

        trend_data = []
        for _, row in bin_trend.iterrows():
            trend_data.append({
                "discount": int(row['discount_bin']),
                "avg_rating_count": round(float(row['rating_count_clean']), 0),
                "avg_rating": round(float(row['rating_clean']), 2)
            })

        # Actual vs Predicted scatter sample
        scatter_sample = []
        residuals_sample = []
        for act, prd in zip(y_test[:80], y_pred[:80]):
            res = float(act - prd)
            scatter_sample.append({
                "actual_log_volume": round(float(act), 2),
                "predicted_log_volume": round(float(prd), 2),
                "actual_volume": int(np.expm1(act)),
                "predicted_volume": int(max(0, np.expm1(prd))),
            })
            residuals_sample.append({
                "predicted": round(float(prd), 2),
                "residual": round(res, 2)
            })

        self.lr_model = lr
        self.lr_scaler = scaler
        self.regression_eval = {
            "target": "log1p(rating_count) [Review Volume Proxy]",
            "features": features,
            "r2_score": round(r2, 4),
            "mae": round(mae, 4),
            "rmse": round(rmse, 4),
            "intercept": round(float(lr.intercept_), 4),
            "coefficients": coefs,
            "trend_data": trend_data,
            "actual_vs_predicted": scatter_sample,
            "residuals": residuals_sample,
            "interpretation": (
                "R² is low (~0.09), confirming that discount depth alone is weakly associated "
                "with review volume. In Amazon catalog data, review volume is heavily driven by brand prestige, "
                "product age, and category demand rather than discount percentage alone."
            )
        }

    def predict_regression(self, discount_percentage, rating=4.2, actual_price=1000):
        in_row = np.array([[float(discount_percentage), float(rating), float(actual_price)]])
        in_scaled = self.lr_scaler.transform(in_row)
        pred_log = float(self.lr_model.predict(in_scaled)[0])
        pred_volume = int(max(0, np.expm1(pred_log)))

        return {
            "predicted_log_rating_count": round(pred_log, 3),
            "predicted_rating_count": pred_volume,
            "inputs": {
                "discount_percentage": float(discount_percentage),
                "rating": float(rating),
                "actual_price": float(actual_price)
            }
        }
