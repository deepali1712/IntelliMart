import pandas as pd
import numpy as np
from collections import defaultdict
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules

class AssociationService:
    def __init__(self, df):
        self.df = df
        self.user_product_baskets = []
        self.user_subcategory_baskets = []
        self._build_baskets()

    def _build_baskets(self):
        user_p = defaultdict(list)
        user_c = defaultdict(list)

        for _, row in self.df.iterrows():
            pid = str(row['product_id'])
            sub_cat = str(row.get('sub_category', row.get('main_category', 'General')))
            users = [u.strip() for u in str(row.get('user_id', '')).split(',') if u.strip()]

            for u in users:
                user_p[u].append(pid)
                user_c[u].append(sub_cat)

        # Filter only users who reviewed > 1 distinct item
        self.user_product_baskets = [list(set(items)) for items in user_p.values() if len(set(items)) > 1]
        self.user_subcategory_baskets = [list(set(items)) for items in user_c.values() if len(set(items)) > 1]

        # Product id to name lookup
        self.id_to_name = dict(zip(self.df['product_id'].astype(str), self.df['product_name'].astype(str)))

    def mine_rules(self, basket_type='sub_category', min_support=0.01, min_confidence=0.1, min_lift=1.0, max_len=3):
        """
        Runs Apriori on real co-review baskets.
        basket_type: 'sub_category' or 'product'
        """
        baskets = self.user_subcategory_baskets if basket_type == 'sub_category' else self.user_product_baskets

        if len(baskets) < 5:
            return {
                "rules": [],
                "meta": {
                    "basket_type": basket_type,
                    "total_baskets": len(baskets),
                    "min_support": min_support,
                    "min_confidence": min_confidence,
                    "min_lift": min_lift,
                    "message": "Insufficient co-review transactions to mine associations."
                }
            }

        te = TransactionEncoder()
        te_ary = te.fit(baskets).transform(baskets)
        df_trans = pd.DataFrame(te_ary, columns=te.columns_)

        frequent_itemsets = apriori(
            df_trans,
            min_support=max(0.001, float(min_support)),
            use_colnames=True,
            max_len=int(max_len)
        )

        if frequent_itemsets.empty:
            return {
                "rules": [],
                "meta": {
                    "basket_type": basket_type,
                    "total_baskets": len(baskets),
                    "frequent_itemsets_found": 0,
                    "message": "No itemsets met the minimum support threshold. Try lowering min_support."
                }
            }

        rules = association_rules(
            frequent_itemsets,
            metric="confidence",
            min_threshold=max(0.01, float(min_confidence))
        )

        if min_lift > 0:
            rules = rules[rules['lift'] >= float(min_lift)]

        rules = rules.sort_values(by="lift", ascending=False).head(50)

        formatted_rules = []
        scatter_points = []
        lift_distribution = [
            {"range": "0.0 - 1.0 (Negative/Neutral association)", "count": 0},
            {"range": "1.0 - 2.0 (Moderate co-occurrence)", "count": 0},
            {"range": "2.0 - 5.0 (Strong co-occurrence)", "count": 0},
            {"range": "5.0+ (Very High co-occurrence)", "count": 0},
        ]

        for _, row in rules.iterrows():
            ant_items = list(row['antecedents'])
            con_items = list(row['consequents'])

            if basket_type == 'product':
                ant_str = " + ".join([self.id_to_name.get(p, p)[:35] for p in ant_items])
                con_str = " + ".join([self.id_to_name.get(p, p)[:35] for p in con_items])
            else:
                ant_str = " + ".join(ant_items)
                con_str = " + ".join(con_items)

            supp = round(float(row['support']), 4)
            conf = round(float(row['confidence']), 4)
            lift = round(float(row['lift']), 4)

            rule_obj = {
                "antecedents": ant_str,
                "consequents": con_str,
                "rule": f"{ant_str} → {con_str}",
                "support": supp,
                "support_pct": round(supp * 100, 2),
                "confidence": conf,
                "confidence_pct": round(conf * 100, 2),
                "lift": lift,
                "leverage": round(float(row.get('leverage', 0)), 4),
                "conviction": round(float(row.get('conviction', 1.0)), 4) if not np.isinf(row.get('conviction', 1.0)) else 999.0
            }
            formatted_rules.append(rule_obj)
            scatter_points.append({
                "rule": rule_obj["rule"],
                "support": round(supp * 100, 2),
                "confidence": round(conf * 100, 2),
                "lift": lift
            })

            if lift < 1.0:
                lift_distribution[0]["count"] += 1
            elif lift < 2.0:
                lift_distribution[1]["count"] += 1
            elif lift < 5.0:
                lift_distribution[2]["count"] += 1
            else:
                lift_distribution[3]["count"] += 1

        return {
            "rules": formatted_rules,
            "scatter_points": scatter_points,
            "lift_distribution": lift_distribution,
            "meta": {
                "basket_type": basket_type,
                "total_baskets": len(baskets),
                "total_rules_mined": len(formatted_rules),
                "data_source_label": f"Real Amazon Co-Review Profiles ({len(baskets)} multi-item reviewer baskets)"
            }
        }
