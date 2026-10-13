import { useState, useEffect } from "react";
import {
  TrendingUp,
  Activity,
  AlertCircle,
  HelpCircle,
  BarChart2,
  Sliders,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { fetchRegressionEval } from "../../services/api";
import HowThisWorks from "../../components/HowThisWorks";
import { LoadingSpinner, ErrorState } from "../../components/StatusFeedback";

export default function AdminRegression() {
  const [evalData, setEvalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRegression();
  }, []);

  const loadRegression = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRegressionEval();
      setEvalData(data);
    } catch (err) {
      console.error("Regression eval error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Fitting linear regression and residual diagnostics..." />;
  if (error) return <ErrorState error={error} onRetry={loadRegression} />;

  const coefs = evalData?.coefficients || {};
  const trend = evalData?.trend_data || [];
  const actualVsPred = evalData?.actual_vs_predicted || [];
  const residuals = evalData?.residuals || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
          Continuous Modeling
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
          Linear Regression: Review Volume vs. Pricing & Discount
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl">
          Evaluates whether deeper discounts drive higher customer review engagement using an ordinary least squares model.
        </p>
      </div>

      {/* Viva / How this works */}
      <HowThisWorks
        algorithm="Ordinary Least Squares (OLS) Linear Regression: y = β₀ + β₁X₁ + β₂X₂ + β₃X₃ + ε"
        features="Predictors: discount_percentage, rating, actual_price (StandardScaler fit on train). Target: log1p(rating_count) as engagement proxy."
        parameters="Train/Test Split: 75% train / 25% test (seed = 42). Standardized regression weights."
        evaluation="R² (Coefficient of Determination), Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and Residual Scatter."
        limitations="R² is low (~0.09). Correlation does NOT imply causation. In commercial e-commerce, review volume is governed by product longevity and advertising rather than discount depth alone."
      />

      {/* Primary Evaluation Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">R² Score</span>
          <div className="text-2xl font-extrabold text-blue-600 tabular-nums">
            {evalData?.r2_score}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Variance explained (~9%)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">MAE</span>
          <div className="text-2xl font-extrabold text-gray-800 tabular-nums">
            {evalData?.mae}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Mean absolute error (log scale)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">RMSE</span>
          <div className="text-2xl font-extrabold text-gray-800 tabular-nums">
            {evalData?.rmse}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Root mean squared error</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Intercept (β₀)</span>
          <div className="text-2xl font-extrabold text-gray-800 tabular-nums">
            {evalData?.intercept}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Baseline log engagement</p>
        </div>
      </div>

      {/* Honest Interpretation Callout */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <Activity size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm mb-0.5">
            Academic Honesty: Interpreting the Low R² Score ({evalData?.r2_score})
          </span>
          {evalData?.interpretation}
        </div>
      </div>

      {/* Regression Coefficients Table */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-gray-900">
          Standardized Feature Coefficients (Relative Influence)
        </h2>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b text-gray-700 font-semibold">
              <tr>
                <th className="p-3">Predictor Feature</th>
                <th className="p-3">Standardized Coefficient (β)</th>
                <th className="p-3">Directional Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              <tr>
                <td className="p-3 font-semibold text-gray-900">Customer Rating (rating_clean)</td>
                <td className="p-3 font-mono font-bold text-emerald-600 tabular-nums">
                  +{coefs.rating}
                </td>
                <td className="p-3 text-gray-600">
                  Strongest positive predictor: higher rated items accumulate more reviews.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-gray-900">Discount Depth (discount_percentage_clean)</td>
                <td className="p-3 font-mono font-bold text-red-600 tabular-nums">
                  {coefs.discount_percentage}
                </td>
                <td className="p-3 text-gray-600">
                  Mild negative weight: discount alone does not guarantee organic customer reviews.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-gray-900">Actual Price (actual_price_clean)</td>
                <td className="p-3 font-mono font-bold text-gray-700 tabular-nums">
                  +{coefs.actual_price}
                </td>
                <td className="p-3 text-gray-600">
                  Minimal influence after standardization.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Row: Binned Trend Chart & Actual vs Predicted */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empirical Discount Bin Trend */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-gray-900">
            Average Review Volume by Discount Decile (Trend Curve)
          </h2>
          <p className="text-xs text-gray-500">
            Empirical review volume across discount brackets (0%, 10%, 20%...)
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="discount" name="Discount %" unit="%" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avg_rating_count"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  name="Mean Reviews"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Residual Diagnostics */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-gray-900">
            Residual Diagnostics (Predicted vs. Residual Error)
          </h2>
          <p className="text-xs text-gray-500">
            Homoscedasticity check: random scatter around 0 indicates unbiased error
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="predicted" name="Predicted (Log)" tick={{ fontSize: 11 }} />
                <YAxis dataKey="residual" name="Residual (Actual - Pred)" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Scatter data={residuals} fill="#DC2626" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
