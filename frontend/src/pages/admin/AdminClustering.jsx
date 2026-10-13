import { useState, useEffect } from "react";
import {
  Network,
  RotateCcw,
  Play,
  Layers,
  Info,
  Check,
  TrendingUp,
} from "lucide-react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { runClustering } from "../../services/api";
import HowThisWorks from "../../components/HowThisWorks";
import { LoadingSpinner, ErrorState } from "../../components/StatusFeedback";

export default function AdminClustering() {
  const [k, setK] = useState(3);
  const [seed, setSeed] = useState(42);
  const [selectedFeatures, setSelectedFeatures] = useState([
    "discount",
    "rating",
    "log_price",
    "log_rating_count",
  ]);
  const [clusterData, setClusterData] = useState(null);
  const [activeClusterFilter, setActiveClusterFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    executeClustering();
  }, [k]);

  const executeClustering = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await runClustering({
        k,
        features: selectedFeatures,
        seed,
      });
      setClusterData(data);
    } catch (err) {
      console.error("Clustering run error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (feat) => {
    if (selectedFeatures.includes(feat)) {
      if (selectedFeatures.length > 2) {
        setSelectedFeatures(selectedFeatures.filter((f) => f !== feat));
      }
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  if (loading) return <LoadingSpinner message="Standardizing features and partitioning K-Means clusters..." />;
  if (error) return <ErrorState error={error} onRetry={executeClustering} />;

  const clusters = clusterData?.clusters || [];
  const elbow = clusterData?.elbow_curve || [];
  const points = clusterData?.points || [];

  const filteredPoints =
    activeClusterFilter !== null
      ? points.filter((p) => p.cluster === activeClusterFilter)
      : points;

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
          Unsupervised Segmentation
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
          K-Means Product Clustering & Segmentation
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl">
          Group catalog items into behavioral clusters based on standardized price points,
          discount depths, customer ratings, and log review volume.
        </p>
      </div>

      {/* Viva / How this works */}
      <HowThisWorks
        algorithm="K-Means Clustering with Lloyd's Algorithm & StandardScaler Z-score Normalization"
        features="Continuous measures: discount_percentage, rating, log1p(discounted_price), log1p(rating_count). Product IDs strictly excluded."
        parameters="K in range [2, 8] (default = 3). n_init = 10 centroid initializations, random_state = 42."
        evaluation="Inertia (Within-Cluster Sum of Squares) elbow curve and Silhouette Coefficient [-1.0, 1.0]."
        limitations="Cluster descriptions are generated programmatically from centroid z-scores relative to catalog mean. No cluster is labeled 'profitable' or 'best' without transactional evidence."
      />

      {/* Interactive Controls Bar */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Clustering Hyperparameters</h2>
            <p className="text-[11px] text-gray-500">Tune cluster count K and feature space</p>
          </div>
          <button
            onClick={executeClustering}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Play size={13} /> Re-cluster Data
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          {/* K Selector */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Number of Clusters (K): <span className="font-extrabold text-blue-600 text-sm">{k}</span>
            </label>
            <input
              type="range"
              min="2"
              max="8"
              value={k}
              onChange={(e) => setK(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>K=2</span>
              <span>K=4</span>
              <span>K=6</span>
              <span>K=8</span>
            </div>
          </div>

          {/* Feature Checkboxes */}
          <div className="sm:col-span-2">
            <label className="block font-semibold text-gray-700 mb-2">
              Feature Selection (Standardized with Z-Scores)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "discount", label: "Discount %" },
                { id: "rating", label: "Customer Rating" },
                { id: "log_price", label: "Log Price" },
                { id: "log_rating_count", label: "Log Review Volume" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => toggleFeature(f.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                    selectedFeatures.includes(f.id)
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-gray-50 text-gray-500 border-gray-200"
                  }`}
                >
                  {selectedFeatures.includes(f.id) && <Check size={12} />}
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row: Scatter Plot & Elbow Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scatter Plot */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Cluster Segmentation Projection
              </h2>
              <p className="text-xs text-gray-500">Discount % vs Customer Rating</p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-semibold">
              Silhouette: {clusterData?.silhouette_score}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  type="number"
                  dataKey="discount"
                  name="Discount %"
                  unit="%"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="rating"
                  name="Rating"
                  domain={[2.5, 5]}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(val, name) => [val, name]}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white p-2.5 border rounded-lg shadow-sm text-xs">
                        <div className="font-bold text-gray-900 line-clamp-1">{d.product_name}</div>
                        <div className="text-gray-500 mt-1">Cluster: {d.cluster + 1}</div>
                        <div className="text-gray-700">Discount: {d.discount}% | Rating: ★{d.rating}</div>
                        <div className="text-gray-700">Price: ₹{d.price?.toLocaleString()}</div>
                      </div>
                    );
                  }}
                />
                <Scatter name="Products" data={filteredPoints}>
                  {filteredPoints.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Elbow Curve & Silhouette Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-gray-900">
            Elbow Method & Inertia Curve (K = 2 to 8)
          </h2>
          <p className="text-xs text-gray-500">
            Assesses optimal K where within-cluster sum of squares levels off
          </p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={elbow} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="k" name="K Clusters" tick={{ fontSize: 11 }} />
                <YAxis dataKey="inertia" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="inertia"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  name="Inertia"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Programmatically Generated Cluster Profiles */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">
            Centroid Characterization (Programmatic Z-Score Profiling)
          </h2>
          {activeClusterFilter !== null && (
            <button
              onClick={() => setActiveClusterFilter(null)}
              className="text-xs text-blue-600 font-semibold"
            >
              Show all clusters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clusters.map((c) => (
            <div
              key={c.cluster_id}
              onClick={() =>
                setActiveClusterFilter(
                  activeClusterFilter === c.cluster_id ? null : c.cluster_id
                )
              }
              className={`p-4 rounded-xl border cursor-pointer transition ${
                activeClusterFilter === c.cluster_id
                  ? "border-blue-600 bg-blue-50/50 shadow-sm"
                  : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  style={{ backgroundColor: c.color }}
                  className="w-3 h-3 rounded-full"
                ></span>
                <span className="font-bold text-sm text-gray-900">{c.name}</span>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-bold">
                  {c.size} items ({c.percentage}%)
                </span>
              </div>

              <p className="text-xs text-gray-700 font-medium mb-3 min-h-[32px] leading-relaxed">
                {c.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-gray-200 text-gray-600">
                <div>Avg Discount: <span className="font-bold text-gray-900">{c.avg_discount}%</span></div>
                <div>Avg Rating: <span className="font-bold text-gray-900">★ {c.avg_rating}</span></div>
                <div>Avg Price: <span className="font-bold text-gray-900">₹{c.avg_price?.toLocaleString()}</span></div>
                <div>Avg Reviews: <span className="font-bold text-gray-900">{c.avg_rating_count?.toLocaleString()}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
