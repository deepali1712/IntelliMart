import { useState, useEffect } from "react";
import {
  fetchAdminMetrics,
  fetchClusters,
  predictSuccess,
  fetchProducts,
  fetchSentimentData,
  fetchRegressionData,
  fetchAprioriRules,
  performOlapOperation,
} from "../services/api";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
} from "recharts";
import {
  Activity,
  Target,
  CheckCircle,
  Percent,
  Database,
  TrendingUp,
  MessageSquare,
  Link as LinkIcon,
  Layers,
} from "lucide-react";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [clusterData, setClusterData] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [priceForm, setPriceForm] = useState({
    actual_price: "",
    discount_percentage: "",
  });
  const [prediction, setPrediction] = useState(null);

  // OLAP State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availableCategories, setAvailableCategories] = useState(["All"]);
  const [olapMode, setOlapMode] = useState("slice");
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [olapResult, setOlapResult] = useState(null);

  // Dynamic DWM State
  const [sentimentData, setSentimentData] = useState([]);
  const [aprioriRules, setAprioriRules] = useState([]);
  const [regressionData, setRegressionData] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadDashboardData();
    executeOlap();
  }, [selectedCategory, olapMode, minRating, minDiscount]);

  const loadInitialData = async () => {
    try {
      const productsRes = await fetchProducts();
      setRecentProducts(productsRes.products.slice(0, 5));
      if (productsRes.categories) {
        setAvailableCategories(["All", ...productsRes.categories]);
      }
    } catch (error) {
      console.error("Error loading initial data", error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [metricsData, clusterRes, sentData, regData, rulesData] =
        await Promise.all([
          fetchAdminMetrics(selectedCategory),
          fetchClusters(selectedCategory),
          fetchSentimentData(selectedCategory),
          fetchRegressionData(selectedCategory),
          fetchAprioriRules(selectedCategory),
        ]);

      setMetrics(metricsData);
      setClusterData(clusterRes.points);
      setSentimentData(sentData);
      setRegressionData(regData);
      setAprioriRules(rulesData);
    } catch (error) {
      console.error("Error loading sliced admin data", error);
    }
  };

  const executeOlap = async () => {
    try {
      const res = await performOlapOperation({
        operation: olapMode,
        category: selectedCategory,
        min_rating: minRating,
        min_discount: minDiscount,
      });
      setOlapResult(res);
    } catch (error) {
      console.error("OLAP execution error", error);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    try {
      const result = await predictSuccess(priceForm);
      setPrediction(result);
    } catch (error) {
      console.error("Error predicting success", error);
    }
  };

  const COLORS = ["#3b82f6", "#ef4444", "#10b981"];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              DWM Admin Intelligence Panel
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Interactive Data Warehouse & Mining Workstation
            </p>
          </div>

          {/* OLAP Operations Bar */}
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 flex-wrap">
            <Layers className="text-blue-600" size={20} />
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                OLAP Operation
              </span>
              <select
                className="bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer text-sm"
                value={olapMode}
                onChange={(e) => setOlapMode(e.target.value)}
              >
                <option value="slice">1. Slice (Single Dimension)</option>
                <option value="dice">2. Dice (Multi-Condition)</option>
                <option value="rollup">3. Roll-Up (Department Summary)</option>
                <option value="pivot">4. Pivot (Category vs Sales)</option>
              </select>
            </div>

            <div className="border-l pl-3 border-gray-300">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Dimension (Category)
              </span>
              <select
                className="bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* OLAP Execution Feedback Banner */}
        {olapResult && (
          <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-xl flex justify-between items-center text-sm">
            <div>
              <span className="font-bold">Active OLAP Cube View:</span>{" "}
              {olapResult.operation}
              <span className="ml-4 opacity-75">
                Filtered Rows: {olapResult.rows_affected}
              </span>
            </div>
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded font-semibold">
              Live Warehouse Query
            </span>
          </div>
        )}

        {/* 1. Classification Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Accuracy"
            value={metrics?.accuracy}
            icon={<Activity />}
          />
          <MetricCard
            title="Precision"
            value={metrics?.precision}
            icon={<Target />}
          />
          <MetricCard
            title="Recall"
            value={metrics?.recall}
            icon={<CheckCircle />}
          />
          <MetricCard
            title="F1-Score"
            value={metrics?.f1_score}
            icon={<Percent />}
          />
        </div>

        {/* Row 1: Clustering & NLP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-2">
              Market Segmentation (K-Means)
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Clustering products by Discount % vs Rating
            </p>
            <div className="flex justify-center overflow-x-auto">
              <ScatterChart
                width={500}
                height={300}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="discount_percentage_clean"
                  name="Discount"
                  unit="%"
                />
                <YAxis
                  type="number"
                  dataKey="rating_clean"
                  name="Rating"
                  domain={[0, 5]}
                />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Products" data={clusterData} fill="#8884d8">
                  {clusterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.cluster % COLORS.length]}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2 w-full">
              <MessageSquare className="text-gray-500" size={20} />
              <h2 className="text-xl font-semibold">
                Catalog Sentiment (VADER)
              </h2>
            </div>
            <p className="text-gray-500 text-sm mb-4 w-full">
              Emotion detected in product reviews
            </p>
            {sentimentData.length > 0 ? (
              <div className="flex justify-center w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-400">
                Processing text data...
              </div>
            )}
            <div className="flex justify-center gap-4 text-sm mt-2 w-full">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>{" "}
                Positive
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div> Neutral
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Negative
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Association & Regression */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon className="text-gray-500" size={20} />
              <h2 className="text-xl font-semibold">
                Cross-Sell Rules (Apriori)
              </h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Frequently Bought Together patterns
            </p>
            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Rule (If → Then)</th>
                    <th className="px-4 py-2">Support</th>
                    <th className="px-4 py-2">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {aprioriRules.length > 0 ? (
                    aprioriRules.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {item.rule}
                        </td>
                        <td className="px-4 py-3">{item.support}</td>
                        <td className="px-4 py-3 text-emerald-600 font-semibold">
                          {item.confidence}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-8 text-center text-gray-400"
                      >
                        No strong association rules found for this slice.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-gray-500" size={20} />
              <h2 className="text-xl font-semibold">
                Discount Impact (Regression)
              </h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Predicting review volume based on discount depth
            </p>
            {regressionData.length > 0 ? (
              <div className="flex justify-center w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={regressionData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="discount" name="Discount %" unit="%" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="salesVolume"
                      stroke="#3b82f6"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-400">
                Calculating regression trend...
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Predictor & OLAP Cube Result Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Success Predictor</h2>
            <form onSubmit={handlePredict} className="space-y-4 flex-grow">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Actual Price (₹)
                </label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={priceForm.actual_price}
                  onChange={(e) =>
                    setPriceForm({ ...priceForm, actual_price: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Planned Discount (%)
                </label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={priceForm.discount_percentage}
                  onChange={(e) =>
                    setPriceForm({
                      ...priceForm,
                      discount_percentage: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium mt-4"
              >
                Predict Category
              </button>
            </form>

            {prediction && (
              <div
                className={`mt-4 p-3 rounded-lg border ${prediction.predicted_category === "High" ? "bg-green-50 border-green-200 text-green-900" : "bg-red-50 border-red-200 text-red-900"}`}
              >
                <h3 className="font-semibold">
                  {prediction.predicted_category} Sales
                </h3>
                <div className="mt-1 text-xs flex justify-between opacity-80">
                  <span>High: {prediction.probability_high}%</span>
                  <span>Low: {prediction.probability_low}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Database className="text-gray-500" size={20} />
              <h2 className="text-xl font-semibold">
                OLAP Cube Query Result View
              </h2>
            </div>
            <div className="overflow-x-auto flex-grow max-h-[300px]">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2">Dimension / Item</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {olapResult?.data?.slice(0, 8).map((row, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[200px]">
                        {row.product_name || row.dimension}
                      </td>
                      <td className="px-4 py-3">
                        {row.primary_category || "Aggregated"}
                      </td>
                      <td className="px-4 py-3">
                        ₹
                        {row.actual_price_clean ||
                          row.avg_actual_price ||
                          "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {row.rating_clean || row.avg_rating || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">
          {value ? `${value}%` : "..."}
        </p>
      </div>
    </div>
  );
}
