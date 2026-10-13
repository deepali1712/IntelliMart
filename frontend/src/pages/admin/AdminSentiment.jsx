import { useState, useEffect } from "react";
import { MessageSquare, PieChart as PieIcon, BarChart3, Search, Info } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { fetchSentimentSummary } from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import HowThisWorks from "../../components/HowThisWorks";
import { LoadingSpinner, ErrorState } from "../../components/StatusFeedback";

export default function AdminSentiment() {
  const { selectedCategory } = useFilters();
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSentiment();
  }, [selectedCategory]);

  const loadSentiment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSentimentSummary(selectedCategory);
      setData(res);
    } catch (err) {
      console.error("Sentiment load error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Evaluating VADER lexicon polarity on review corpus..." />;
  if (error) return <ErrorState error={error} onRetry={loadSentiment} />;

  const dist = data?.distribution || [];
  const catBreakdown = data?.category_breakdown || [];
  const hist = data?.histogram || [];
  const prods = data?.products || [];

  const filteredProds = search
    ? prods.filter((p) =>
        p.product_name.toLowerCase().includes(search.toLowerCase())
      )
    : prods;

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
          NLP Sentiment Engine
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
          Catalog Review Sentiment Analysis (VADER)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl">
          Rule-based sentiment intensity analysis evaluated across product review titles and combined content.
        </p>
      </div>

      {/* Viva / How this works */}
      <HowThisWorks
        algorithm="VADER (Valence Aware Dictionary and sEntiment Reasoner) Lexicon-Based Rule Scoring"
        features="Product-level combined review text: review_title + review_content. Evaluated at product level to avoid comma-split misalignment."
        parameters="Classification Thresholds: Positive (Compound ≥ +0.05), Negative (Compound ≤ -0.05), Neutral (-0.05 < Compound < +0.05)."
        evaluation="Compound normalized score in [-1.0, +1.0] across all catalog records with review text."
        limitations="Because multiple reviews are stored per row with internal commas, product-level aggregation is the only honest parsing approach. Individual review attribution is not fabricated."
      />

      {/* Row 1: Donut Chart & Score Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center justify-between">
            <span>Overall Sentiment Proportions</span>
            <span className="text-xs text-gray-500 font-normal">
              {data?.total_analyzed} products analyzed
            </span>
          </h2>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dist}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {dist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-6 text-xs font-semibold">
            {dist.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span
                  style={{ backgroundColor: d.color }}
                  className="w-3 h-3 rounded-full"
                ></span>
                <span className="text-gray-700">
                  {d.name}: {d.value}% ({d.count})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Compound Score Distribution Histogram */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900">
            Compound Valence Score Distribution
          </h2>
          <p className="text-xs text-gray-500">
            Frequencies across 5 calibrated polarity bins
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hist} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
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
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} name="Products" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Sentiment by Category Breakdown */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">
          Sentiment Breakdown by Department (Category Slice)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 uppercase font-semibold text-gray-700 border-b">
              <tr>
                <th className="p-3">Department</th>
                <th className="p-3">Positive %</th>
                <th className="p-3">Positive Items</th>
                <th className="p-3">Neutral Items</th>
                <th className="p-3">Negative Items</th>
                <th className="p-3">Total Analyzed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {catBreakdown.map((c) => (
                <tr key={c.category} className="hover:bg-gray-50">
                  <td className="p-3 font-semibold text-gray-900">{c.category}</td>
                  <td className="p-3 font-bold text-emerald-600 tabular-nums">
                    {c.pos_pct}%
                  </td>
                  <td className="p-3 tabular-nums">{c.Positive}</td>
                  <td className="p-3 tabular-nums">{c.Neutral}</td>
                  <td className="p-3 tabular-nums">{c.Negative}</td>
                  <td className="p-3 font-bold text-gray-900 tabular-nums">{c.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Searchable Product Sentiment Table */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-gray-900">
            Per-Product Sentiment Classification Table
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 w-60 focus:outline-none"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-80">
          <table className="w-full text-xs text-left text-gray-700">
            <thead className="bg-gray-50 uppercase font-semibold text-gray-800 sticky top-0 border-b">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Sentiment</th>
                <th className="p-3">Compound Score</th>
                <th className="p-3">Sample Review Headline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProds.slice(0, 50).map((p) => (
                <tr key={p.product_id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900 truncate max-w-xs">
                    {p.product_name}
                  </td>
                  <td className="p-3 text-gray-600">{p.main_category}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        p.sentiment === "Positive"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : p.sentiment === "Negative"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {p.sentiment}
                    </span>
                  </td>
                  <td className="p-3 font-mono tabular-nums">{p.compound_score}</td>
                  <td className="p-3 text-gray-500 italic truncate max-w-xs">
                    "{p.sample_review_title}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
