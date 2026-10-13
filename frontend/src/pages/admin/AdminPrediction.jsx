import { useState, useEffect } from "react";
import { Cpu, Play, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { predictClassification, fetchCategories } from "../../services/api";
import HowThisWorks from "../../components/HowThisWorks";

export default function AdminPrediction() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    actual_price: "1999",
    discount_percentage: "45",
    category: "Computers&Accessories",
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCats();
  }, []);

  const loadCats = async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats || []);
    } catch (e) {
      console.error("Error loading categories", e);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await predictClassification({
        actual_price: parseFloat(form.actual_price),
        discount_percentage: parseFloat(form.discount_percentage),
        category: form.category,
      });
      setPrediction(res);
    } catch (err) {
      console.error("Prediction error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
          Inference Engine
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
          Rating Tier Prediction Playground (Naïve Bayes)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl">
          Simulate prospective catalog pricing strategies and predict the probability of reaching
          the High Rating Tier (Rating ≥ 4.2) using the trained Gaussian Naïve Bayes model.
        </p>
      </div>

      {/* Viva / How this works */}
      <HowThisWorks
        algorithm="Inference Pipeline: Preprocessing Transform → Gaussian Naïve Bayes .predict_proba()"
        features="Input Vector: [actual_price, discount_percentage, estimated_discounted_price, category_frequency_encoding]. Standardized with saved training scaler."
        parameters="Output classes: 'High' (Rating ≥ 4.2) vs 'Low' (Rating < 4.2). Threshold calibrated for ~47% / 53% balanced prior."
        evaluation="Returns class assignment and posterior probability distributions P(High | X) and P(Low | X)."
        limitations="Predicts customer rating tier based on catalog pricing and department norms. Does NOT forecast unit sales or revenue."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Cpu size={18} className="text-blue-600" />
            Product Strategy Inputs
          </h2>

          <form onSubmit={handlePredict} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Actual Listed Price (₹)
              </label>
              <input
                type="number"
                min="50"
                max="100000"
                required
                value={form.actual_price}
                onChange={(e) => setForm({ ...form, actual_price: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-medium"
              />
              <span className="text-[11px] text-gray-400 mt-0.5 block">
                Standard MSRP before discount
              </span>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Planned Discount Depth (%)
              </label>
              <input
                type="number"
                min="0"
                max="95"
                required
                value={form.discount_percentage}
                onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-medium"
              />
              <span className="text-[11px] text-gray-400 mt-0.5 block">
                Estimated selling price: ₹
                {Math.round(
                  parseFloat(form.actual_price || 0) *
                    (1 - parseFloat(form.discount_percentage || 0) / 100)
                ).toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Target Department / Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 mt-4"
            >
              <Play size={14} /> Run Gaussian Naïve Bayes Model
            </button>
          </form>
        </div>

        {/* Prediction Output Display */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900">
            Model Inference Results
          </h2>

          {prediction ? (
            <div className="space-y-4">
              <div
                className={`p-5 rounded-xl border ${
                  prediction.predicted_category === "High"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                    : "bg-red-50 border-red-200 text-red-950"
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider opacity-75">
                  Predicted Rating Outcome
                </div>
                <div className="text-2xl font-extrabold mt-1">
                  {prediction.predicted_category === "High"
                    ? "High Tier (Rating ≥ 4.2)"
                    : "Low Tier (Rating < 4.2)"}
                </div>
                <p className="text-xs mt-1 opacity-90">
                  {prediction.predicted_category === "High"
                    ? "Pricing strategy aligns with features of top-rated Amazon catalog offerings."
                    : "Pricing parameters align with below-average customer satisfaction brackets."}
                </p>
              </div>

              {/* Class Probability Gauges */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-gray-700 block">
                  Posterior Class Probabilities (Naïve Bayes)
                </span>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-emerald-700">P(High Tier ≥ 4.2):</span>
                    <span className="tabular-nums font-bold">{prediction.probability_high}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      style={{ width: `${prediction.probability_high}%` }}
                      className="bg-emerald-500 h-2.5 rounded-full"
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1 pt-1">
                    <span className="text-red-700">P(Low Tier &lt; 4.2):</span>
                    <span className="tabular-nums font-bold">{prediction.probability_low}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      style={{ width: `${prediction.probability_low}%` }}
                      className="bg-red-500 h-2.5 rounded-full"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Verification Metadata */}
              <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-400 space-y-1">
                <div>Model: GaussianNB (StandardScaler pipeline)</div>
                <div>Precomputed Accuracy: {prediction.model_metrics?.accuracy}%</div>
                <div>F1-Score: {prediction.model_metrics?.f1_score}%</div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-gray-400 text-xs">
              Configure parameters on the left and click "Run Gaussian Naïve Bayes Model" to view inference.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
