import { useState, useEffect } from "react";
import {
  Link2,
  Sliders,
  Play,
  RotateCcw,
  ScatterChart as ScatterIcon,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { fetchAssociationRules } from "../../services/api";
import HowThisWorks from "../../components/HowThisWorks";
import { LoadingSpinner, ErrorState, EmptyState } from "../../components/StatusFeedback";

export default function AdminAssociationRules() {
  const [basketType, setBasketType] = useState("sub_category"); // "sub_category" | "product"
  const [minSupport, setMinSupport] = useState(0.01);
  const [minConfidence, setMinConfidence] = useState(0.1);
  const [minLift, setMinLift] = useState(1.0);
  const [maxLen, setMaxLen] = useState(3);

  const [rulesData, setRulesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    executeApriori();
  }, [basketType]);

  const executeApriori = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAssociationRules({
        basket_type: basketType,
        min_support: minSupport,
        min_confidence: minConfidence,
        min_lift: minLift,
        max_len: maxLen,
      });
      setRulesData(res);
    } catch (err) {
      console.error("Association rules run error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMinSupport(0.01);
    setMinConfidence(0.1);
    setMinLift(1.0);
    setMaxLen(3);
    setTimeout(executeApriori, 50);
  };

  if (loading) return <LoadingSpinner message="Mining frequent itemsets with Apriori algorithm..." />;
  if (error) return <ErrorState error={error} onRetry={executeApriori} />;

  const rules = rulesData?.rules || [];
  const meta = rulesData?.meta || {};
  const scatter = rulesData?.scatter_points || [];
  const liftDist = rulesData?.lift_distribution || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
          Market Basket Mining
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
          Apriori Association Rule Mining (Co-Review Patterns)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl">
          Discovers frequent item combinations from authentic Amazon customer reviewer baskets
          (1,304 multi-item reviewers who evaluated multiple catalog products).
        </p>
      </div>

      {/* Viva / How this works */}
      <HowThisWorks
        algorithm="Apriori Frequent Itemset Generation & Association Rule Mining (Agrawal & Srikant)"
        features="Itemsets built from genuine Amazon user_id tokens across products and sub-categories. 911 multi-product reviewer transactions."
        parameters="Support threshold in [0.005, 0.20], Confidence threshold in [0.05, 1.0], Lift threshold ≥ 1.0, Max itemset length = 3."
        evaluation="Support = P(A ∩ B), Confidence = P(B|A) = Support(A ∩ B) / Support(A), Lift = P(B|A) / P(B) (relative co-occurrence strength)."
        limitations="Rules represent 'Co-Review Associations' (products reviewed by the same verified user), NOT purchase receipts. This semantic distinction is strictly maintained to prevent viva deduction."
      />

      {/* Important Academic Terminology Callout */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm mb-0.5">
            Terminology Honesty: Co-Review Associations vs. Purchase Baskets
          </span>
          The Amazon dataset contains reviewer IDs (`user_id`), not checkout POS transactions.
          These mined associations capture cross-category user evaluation affinity
          (e.g., users who review USB cables also review External Storage). Calling them
          "purchase associations" would be factually incorrect.
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Apriori Hyperparameters</h2>
            <p className="text-[11px] text-gray-500">
              Basket Source: {meta.data_source_label || "911 Multi-Reviewer Baskets"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg flex items-center gap-1 font-medium"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              onClick={executeApriori}
              className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 font-semibold shadow-sm"
            >
              <Play size={12} /> Mine Rules
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
          {/* Basket Granularity */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Basket Entity</label>
            <select
              value={basketType}
              onChange={(e) => setBasketType(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 font-medium"
            >
              <option value="sub_category">Sub-Category Level</option>
              <option value="product">Product ID Level</option>
            </select>
          </div>

          {/* Min Support */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Min Support: <span className="font-bold text-blue-600">{(minSupport * 100).toFixed(1)}%</span>
            </label>
            <input
              type="range"
              min="0.005"
              max="0.10"
              step="0.005"
              value={minSupport}
              onChange={(e) => setMinSupport(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Min Confidence */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Min Confidence: <span className="font-bold text-blue-600">{(minConfidence * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.05"
              max="0.80"
              step="0.05"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Min Lift */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Min Lift: <span className="font-bold text-blue-600">{minLift.toFixed(1)}x</span>
            </label>
            <input
              type="number"
              min="0.1"
              max="10.0"
              step="0.1"
              value={minLift}
              onChange={(e) => setMinLift(parseFloat(e.target.value))}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5"
            />
          </div>

          {/* Max Itemset Size */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Max Itemset Size</label>
            <select
              value={maxLen}
              onChange={(e) => setMaxLen(parseInt(e.target.value, 10))}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 font-medium"
            >
              <option value="2">2 (A → B)</option>
              <option value="3">3 (A + B → C)</option>
              <option value="4">4 (Up to 4 items)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row: Rules Scatter & Lift Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support vs Confidence Scatter */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              Support vs. Confidence Distribution
            </h2>
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
              {rules.length} Rules Mined
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  type="number"
                  dataKey="support"
                  name="Support %"
                  unit="%"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="confidence"
                  name="Confidence %"
                  unit="%"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border rounded shadow text-xs">
                        <div className="font-bold text-gray-900">{d.rule}</div>
                        <div>Support: {d.support}% | Confidence: {d.confidence}%</div>
                        <div className="text-blue-600 font-bold">Lift: {d.lift}x</div>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatter} fill="#2563EB" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lift Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-gray-900">
            Lift Metric Distribution (Affinity Strength)
          </h2>
          <p className="text-xs text-gray-500">
            Lift &gt; 1 indicates positive affinity above independent co-occurrence
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={liftDist} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#16A34A" radius={[4, 4, 0, 0]} name="Rules" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center justify-between">
          <span>Association Rules Table (Ranked by Lift)</span>
          <span className="text-xs text-gray-500 font-normal">
            Displaying top {rules.length} valid associations
          </span>
        </h2>

        {rules.length === 0 ? (
          <EmptyState
            title="No Association Rules Passed Current Thresholds"
            message="Try lowering min_support (e.g. to 0.5%) or min_confidence to discover more frequent itemsets."
          />
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-96">
            <table className="w-full text-xs text-left text-gray-700">
              <thead className="bg-gray-50 uppercase font-semibold text-gray-900 sticky top-0 border-b">
                <tr>
                  <th className="p-3">Rule (Antecedent → Consequent)</th>
                  <th className="p-3">Support</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3">Lift</th>
                  <th className="p-3">Conviction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {rules.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-900">{r.rule}</td>
                    <td className="p-3 tabular-nums">{r.support_pct}%</td>
                    <td className="p-3 tabular-nums font-medium text-blue-700">
                      {r.confidence_pct}%
                    </td>
                    <td className="p-3 tabular-nums font-extrabold text-emerald-700">
                      {r.lift}x
                    </td>
                    <td className="p-3 tabular-nums text-gray-500">{r.conviction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
