import { useState, useEffect } from "react";
import {
  Database,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  BarChart3,
  Layers,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  fetchDatasetSummary,
  fetchDatasetColumns,
  fetchDatasetPreview,
} from "../../services/api";
import HowThisWorks from "../../components/HowThisWorks";
import { LoadingSpinner, ErrorState } from "../../components/StatusFeedback";

export default function AdminDataset() {
  const [summary, setSummary] = useState(null);
  const [columns, setColumns] = useState([]);
  const [preview, setPreview] = useState([]);
  const [previewMeta, setPreviewMeta] = useState({ total: 0, page: 1, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Preview table state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    loadDatasetMeta();
  }, []);

  useEffect(() => {
    loadPreviewData();
  }, [page, category]);

  const loadDatasetMeta = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, colRes] = await Promise.all([
        fetchDatasetSummary(),
        fetchDatasetColumns(),
      ]);
      setSummary(sumRes);
      setColumns(colRes);
    } catch (err) {
      console.error("Dataset explorer load error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPreviewData = async () => {
    try {
      const res = await fetchDatasetPreview({
        page,
        per_page: 15,
        search: search || undefined,
        category: category !== "All" ? category : undefined,
      });
      setPreview(res.items || []);
      setPreviewMeta(res.meta || { total: 0, page: 1, total_pages: 1 });
    } catch (err) {
      console.error("Preview load error", err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadPreviewData();
  };

  if (loading) return <LoadingSpinner message="Profiling dataset schema, distributions, and missing values..." />;
  if (error) return <ErrorState error={error} onRetry={loadDatasetMeta} />;

  const catDist = summary?.category_distribution || [];
  const cleaning = summary?.cleaning_report || {};
  const stats = summary?.numeric_stats || {};

  // Model-to-Field Usage Map
  const usageMap = [
    { field: "discounted_price_clean", models: ["OLAP Measures", "Recommender", "Storefront Pricing", "K-Means (log)"] },
    { field: "actual_price_clean", models: ["Naïve Bayes Features", "Regression Predictor", "OLAP Aggregation"] },
    { field: "discount_percentage_clean", models: ["Naïve Bayes Features", "Regression Predictor", "K-Means", "OLAP Bucketing"] },
    { field: "rating_clean", models: ["Classification Target (Threshold 4.2)", "K-Means Clustering", "Storefront Ranking"] },
    { field: "rating_count_clean", models: ["Regression Target log1p(rating_count)", "K-Means (log)", "Review Popularity"] },
    { field: "main_category & sub_category", models: ["OLAP Dimensions (Roll-up / Drill-down)", "TF-IDF Corpus", "Naïve Bayes (frequency encoded)"] },
    { field: "about_product & product_name", models: ["TF-IDF Recommender Engine (5,000 n-gram features)"] },
    { field: "review_content & review_title", models: ["VADER Sentiment Intensity Analyzer (Compound Score)"] },
    { field: "user_id (co-review tokens)", models: ["Apriori Frequent Itemset Basket Mining (1,304 multi-product users)"] },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header with Download Action */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
            Data Warehouse Layer
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Dataset Explorer & Schema Profiler
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Comprehensive audit of the 1,465 Amazon product records, imputation rules, and analytical transformations.
          </p>
        </div>

        <a
          href="http://localhost:5001/api/dataset/download"
          download
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm self-start md:self-auto"
        >
          <Download size={15} /> Download Cleaned CSV
        </a>
      </div>

      {/* Viva / How this works */}
      <HowThisWorks
        algorithm="ETL (Extract, Transform, Load) Pipeline & Data Warehousing Profiling"
        features="16 Raw attributes transformed into 24 cleaned analytical features with zero silent row deletions."
        parameters="Pricing: currency symbols stripped. Rating: median imputation on row 1279 ('|'). Rating count: median imputation on 2 nulls."
        evaluation="100% type safety across continuous float arrays and discrete category hierarchy levels."
        limitations="The source dataset is an Amazon product crawl. While ratings and prices are genuine, sales transactions are not recorded and are never simulated."
      />

      {/* ETL Cleaning & Imputation Audit Box */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <CheckCircle size={18} className="text-emerald-600" />
          ETL Transformation & Imputation Log (Audit Integrity)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <span className="font-bold text-gray-800 block">Rows Retained</span>
            <div className="text-xl font-extrabold text-emerald-600">
              {cleaning.final_rows || 1465} / {cleaning.raw_rows || 1465} (100%)
            </div>
            <p className="text-gray-500 text-[11px]">
              Zero rows silently dropped; missing attributes imputed with documented strategies.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <span className="font-bold text-gray-800 block">Rating Imputations</span>
            <div className="text-xl font-extrabold text-blue-600">
              1 record imputed (median = 4.2)
            </div>
            <p className="text-gray-500 text-[11px]">
              Row 1279 (B08L12N5H1) contained stray '|' character; safely imputed with catalog median.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <span className="font-bold text-gray-800 block">Rating Count Imputations</span>
            <div className="text-xl font-extrabold text-blue-600">
              2 records imputed (median = 5,179)
            </div>
            <p className="text-gray-500 text-[11px]">
              Comma formatted strings converted to continuous numeric integers.
            </p>
          </div>
        </div>
      </div>

      {/* Category Distribution BarChart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 size={18} className="text-blue-600" />
          Products per Main Category (Warehouse Dimension Distribution)
        </h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={catDist} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="category"
                angle={-25}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11, fill: "#64748B" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E2E8F0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} name="Products" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Numerical Summary Stats Table */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">
          Descriptive Summary Statistics (Continuous Measures)
        </h2>
        <div className="overflow-x-auto text-xs text-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-900">
                <th className="p-3">Measure</th>
                <th className="p-3">Mean</th>
                <th className="p-3">Std Dev</th>
                <th className="p-3">Min</th>
                <th className="p-3">Median</th>
                <th className="p-3">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono">
              {Object.entries(stats).map(([k, s]) => (
                <tr key={k} className="hover:bg-gray-50/50">
                  <td className="p-3 font-sans font-semibold text-gray-900">{k}</td>
                  <td className="p-3">₹{s.mean.toLocaleString()}</td>
                  <td className="p-3">{s.std.toLocaleString()}</td>
                  <td className="p-3">{s.min.toLocaleString()}</td>
                  <td className="p-3 font-bold text-blue-600">{s.median.toLocaleString()}</td>
                  <td className="p-3">{s.max.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Field-to-Model Usage Map */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Layers size={18} className="text-purple-600" />
          Field-to-Model Usage Map (Lineage & Architecture)
        </h2>
        <div className="overflow-x-auto text-xs text-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-900">
                <th className="p-3 w-1/3">Dataset Feature</th>
                <th className="p-3">Downstream Analytical Models & OLAP Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usageMap.map((u, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="p-3 font-mono font-bold text-gray-800">{u.field}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1.5">
                      {u.models.map((m, mi) => (
                        <span
                          key={mi}
                          className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[11px] font-medium border border-blue-100"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Searchable Paginated Preview Table */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-gray-900">
            Interactive Analytical Preview Table
          </h2>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Search by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 w-48 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
            >
              Filter
            </button>
          </form>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-96">
          <table className="w-full text-xs text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold sticky top-0 border-b border-gray-200">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Disc %</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Price Bucket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {preview.map((row) => (
                <tr key={row.product_id} className="hover:bg-gray-50/70">
                  <td className="p-3 font-mono text-gray-500">{row.product_id}</td>
                  <td className="p-3 font-medium text-gray-900 truncate max-w-xs" title={row.product_name}>
                    {row.product_name}
                  </td>
                  <td className="p-3 text-blue-600">{row.main_category}</td>
                  <td className="p-3 font-bold text-gray-900 tabular-nums">
                    ₹{row.discounted_price_clean?.toLocaleString()}
                  </td>
                  <td className="p-3 tabular-nums">{row.discount_percentage_clean}%</td>
                  <td className="p-3 tabular-nums">★ {row.rating_clean}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-medium text-gray-700">
                      {row.price_bucket}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <span>
            Showing page <span className="font-bold text-gray-900">{previewMeta.page}</span> of{" "}
            <span className="font-bold text-gray-900">{previewMeta.total_pages}</span> ({previewMeta.total} items)
          </span>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page >= previewMeta.total_pages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-700 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
