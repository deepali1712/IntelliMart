import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Binary,
  Target,
  Percent,
  Activity,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { fetchClassificationEval } from "../../services/api";
import HowThisWorks from "../../components/HowThisWorks";
import { LoadingSpinner, ErrorState } from "../../components/StatusFeedback";

export default function AdminClassification() {
  const [evalData, setEvalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEval();
  }, []);

  const loadEval = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClassificationEval();
      setEvalData(data);
    } catch (err) {
      console.error("Classification eval error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Evaluating Gaussian Naïve Bayes on test split..." />;
  if (error) return <ErrorState error={error} onRetry={loadEval} />;

  const cm = evalData?.confusion_matrix || [
    { actual: "Low", predicted_low: 0, predicted_high: 0 },
    { actual: "High", predicted_low: 0, predicted_high: 0 },
  ];

  const dist = evalData?.class_distribution || { High: 685, Low: 780 };
  const total = dist.High + dist.Low || 1465;

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
            Supervised Learning Module
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Naïve Bayes Classification (Rating Tier)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Predicting whether an item reaches the High Rating Tier (Rating ≥ 4.2) using pricing depth and category frequency.
          </p>
        </div>

        <Link
          to="/admin/prediction"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm self-start md:self-auto"
        >
          Open Prediction Playground <ArrowRight size={14} />
        </Link>
      </div>

      {/* Viva / How this works */}
      <HowThisWorks
        algorithm="Gaussian Naïve Bayes (Maximum A Posteriori with Bayes' Theorem under Conditional Feature Independence)"
        features="actual_price_clean, discount_percentage_clean, discounted_price_clean, main_category_encoded (Frequency encoded). Zero rating-derived leakage."
        parameters="Classification Threshold = 4.2 (selected for near 50/50 class balance: 46.8% High vs 53.2% Low). Test Size: 30% stratified split (seed = 42)."
        evaluation="Accuracy, Precision, Recall, and F1 (pos_label = 'High'). Compared against Zero-R Majority Class baseline."
        limitations="This model predicts rating tier, NOT sales volume or financial success. Accuracy is modest (~55-60%), reflecting that product rating in reality depends on build quality, packaging, and brand reputation rather than price alone."
      />

      {/* Honest Viva Notice */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <ShieldAlert size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm mb-0.5">
            Academic Honesty: Rating-Tier vs. Sales Success
          </span>
          Because the Amazon dataset contains catalog listings without customer transactions,
          this model objectively predicts rating tier (≥ 4.2), not sales velocity. All feature
          scaling and frequency encoding are fit strictly on training splits to prevent data leakage.
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Accuracy</span>
          <div className="text-2xl font-extrabold text-blue-600 tabular-nums">
            {evalData?.accuracy}%
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Overall test accuracy</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Precision (High)</span>
          <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">
            {evalData?.precision}%
          </div>
          <p className="text-[11px] text-gray-400 mt-1">TP / (TP + FP)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Recall (High)</span>
          <div className="text-2xl font-extrabold text-amber-600 tabular-nums">
            {evalData?.recall}%
          </div>
          <p className="text-[11px] text-gray-400 mt-1">TP / (TP + FN)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">F1-Score</span>
          <div className="text-2xl font-extrabold text-purple-600 tabular-nums">
            {evalData?.f1_score}%
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Harmonic mean</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm col-span-2 md:col-span-1">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Majority Baseline</span>
          <div className="text-2xl font-extrabold text-gray-700 tabular-nums">
            {evalData?.baseline_accuracy}%
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Zero-R naive baseline</p>
        </div>
      </div>

      {/* Row 2: Confusion Matrix & Class Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Confusion Matrix Heatmap */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center justify-between">
            <span>Confusion Matrix (Test Sample n = {evalData?.test_sample_size})</span>
            <span className="text-xs text-gray-400 font-normal">Rows: Actual | Cols: Predicted</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border-r bg-gray-50"></th>
                  <th className="p-3 bg-gray-50 font-bold text-gray-700 border-b">
                    Pred: Low (&lt; 4.2)
                  </th>
                  <th className="p-3 bg-gray-50 font-bold text-gray-700 border-b">
                    Pred: High (≥ 4.2)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-sm">
                <tr>
                  <td className="p-3 font-sans font-bold text-gray-800 bg-gray-50 border-r text-left">
                    Actual: Low
                  </td>
                  <td className="p-4 bg-blue-50/70 text-blue-900 font-extrabold">
                    {cm[0]?.predicted_low} (TN)
                  </td>
                  <td className="p-4 bg-red-50/50 text-red-700 font-semibold">
                    {cm[0]?.predicted_high} (FP)
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-bold text-gray-800 bg-gray-50 border-r text-left">
                    Actual: High
                  </td>
                  <td className="p-4 bg-red-50/50 text-red-700 font-semibold">
                    {cm[1]?.predicted_low} (FN)
                  </td>
                  <td className="p-4 bg-emerald-50/70 text-emerald-900 font-extrabold">
                    {cm[1]?.predicted_high} (TP)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Per-Class Report Table */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900">
            Per-Class Performance & Balance Breakdown
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b">
                <tr>
                  <th className="p-3">Class</th>
                  <th className="p-3">Precision</th>
                  <th className="p-3">Recall</th>
                  <th className="p-3">F1-Score</th>
                  <th className="p-3">Test Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-xs">
                <tr>
                  <td className="p-3 font-sans font-bold text-emerald-700">High Tier (≥ 4.2)</td>
                  <td className="p-3">{evalData?.per_class_report?.High?.precision}%</td>
                  <td className="p-3">{evalData?.per_class_report?.High?.recall}%</td>
                  <td className="p-3">{evalData?.per_class_report?.High?.f1}%</td>
                  <td className="p-3">{evalData?.per_class_report?.High?.support}</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-bold text-gray-700">Low Tier (&lt; 4.2)</td>
                  <td className="p-3">{evalData?.per_class_report?.Low?.precision}%</td>
                  <td className="p-3">{evalData?.per_class_report?.Low?.recall}%</td>
                  <td className="p-3">{evalData?.per_class_report?.Low?.f1}%</td>
                  <td className="p-3">{evalData?.per_class_report?.Low?.support}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg text-[11px] text-gray-500">
            <span className="font-bold text-gray-700 block">Class Balance Rationale:</span>
            Full Catalog: High Tier = {dist.High} ({Math.round((dist.High / total) * 100)}%),
            Low Tier = {dist.Low} ({Math.round((dist.Low / total) * 100)}%).
            Chosen to avoid extreme class skew while setting a high performance bar.
          </div>
        </div>
      </div>
    </div>
  );
}
