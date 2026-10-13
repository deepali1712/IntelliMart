import { useState, useEffect } from "react";
import {
  Layers,
  Code,
  RotateCcw,
  Play,
  Grid,
  ChevronRight,
  Database,
  Sliders,
} from "lucide-react";
import {
  performOlapSlice,
  performOlapDice,
  performOlapRollup,
  performOlapDrilldown,
  performOlapPivot,
  fetchCategories,
} from "../../services/api";
import HowThisWorks from "../../components/HowThisWorks";
import { LoadingSpinner, ErrorState } from "../../components/StatusFeedback";

export default function AdminOlap() {
  const [activeTab, setActiveTab] = useState("slice"); // slice, dice, rollup, drilldown, pivot
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Slice state
  const [sliceDim, setSliceDim] = useState("main_category");
  const [sliceVal, setSliceVal] = useState("Computers&Accessories");

  // Dice state
  const [diceCategory, setDiceCategory] = useState("Electronics");
  const [diceMinRating, setDiceMinRating] = useState(4.0);
  const [diceMinDiscount, setDiceMinDiscount] = useState(30);
  const [diceMaxPrice, setDiceMaxPrice] = useState(5000);

  // Rollup state
  const [rollupLevel, setRollupLevel] = useState("main_category");

  // Drilldown state
  const [drillCategory, setDrillCategory] = useState("Computers&Accessories");
  const [drillSubCat, setDrillSubCat] = useState("");

  // Pivot state
  const [pivotRow, setPivotRow] = useState("main_category");
  const [pivotCol, setPivotCol] = useState("rating_bucket");
  const [pivotMeasure, setPivotMeasure] = useState("product_count");

  useEffect(() => {
    loadCategories();
    executeOperation();
  }, [activeTab]);

  const loadCategories = async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats || []);
    } catch (e) {
      console.error("Error loading categories", e);
    }
  };

  const executeOperation = async () => {
    setLoading(true);
    setError(null);
    try {
      let res = null;
      if (activeTab === "slice") {
        res = await performOlapSlice(sliceDim, sliceVal);
      } else if (activeTab === "dice") {
        res = await performOlapDice({
          category: diceCategory,
          min_rating: diceMinRating,
          min_discount: diceMinDiscount,
          max_price: diceMaxPrice,
        });
      } else if (activeTab === "rollup") {
        res = await performOlapRollup(rollupLevel);
      } else if (activeTab === "drilldown") {
        res = await performOlapDrilldown(drillCategory, drillSubCat || null);
      } else if (activeTab === "pivot") {
        res = await performOlapPivot(pivotRow, pivotCol, pivotMeasure);
      }
      setResult(res);
    } catch (err) {
      console.error("OLAP execution error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (activeTab === "slice") {
      setSliceDim("main_category");
      setSliceVal("Computers&Accessories");
    } else if (activeTab === "dice") {
      setDiceCategory("Electronics");
      setDiceMinRating(4.0);
      setDiceMinDiscount(30);
      setDiceMaxPrice(5000);
    } else if (activeTab === "rollup") {
      setRollupLevel("main_category");
    } else if (activeTab === "drilldown") {
      setDrillCategory("Computers&Accessories");
      setDrillSubCat("");
    } else if (activeTab === "pivot") {
      setPivotRow("main_category");
      setPivotCol("rating_bucket");
      setPivotMeasure("product_count");
    }
    setTimeout(executeOperation, 50);
  };

  const tabs = [
    { id: "slice", label: "1. Slice", desc: "Single dimension filter" },
    { id: "dice", label: "2. Dice", desc: "Multi-constraint sub-cube" },
    { id: "rollup", label: "3. Roll-Up", desc: "Hierarchy summarization" },
    { id: "drilldown", label: "4. Drill-Down", desc: "Granular breakdown" },
    { id: "pivot", label: "5. Pivot / Heatmap", desc: "2D crosstab matrix" },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
          OLAP Cube Engine
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
          Online Analytical Processing (OLAP) Workstation
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl">
          Execute multidimensional warehouse operations on the verified product cube.
          Trace operations directly with generated ANSI pseudo-SQL statements.
        </p>
      </div>

      {/* Viva / How this works */}
      <HowThisWorks
        algorithm="Multidimensional OLAP (MOLAP / ROLAP) GroupBy & Aggregate Matrix"
        features="Dimensions: main_category, sub_category, rating_bucket, discount_bucket, price_bucket. Measures: COUNT(*), AVG(price), AVG(discount), AVG(rating)."
        parameters="Slice: dimension equality. Dice: conjunctive WHERE filters. Roll-Up: category rollup. Drill-Down: product-level descent. Pivot: 2D crosstab."
        evaluation="Results verified against manual pandas .groupby() and .pivot_table() calculations with fill_value=0."
        limitations="Pseudo-SQL statements are generated for demonstration traceability and are never executed directly against raw user strings, guaranteeing complete injection safety."
      />

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-gray-100 p-1.5 rounded-xl">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`p-2.5 rounded-lg text-left transition ${
              activeTab === t.id
                ? "bg-white text-blue-600 font-bold shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
            }`}
          >
            <span className="text-xs block">{t.label}</span>
            <span className="text-[10px] text-gray-400 block truncate">{t.desc}</span>
          </button>
        ))}
      </div>

      {/* Control Configuration Panel */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Sliders size={16} className="text-blue-600" />
            Parameter Controls: {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1 font-medium transition"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              onClick={executeOperation}
              className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 font-semibold transition shadow-sm"
            >
              <Play size={12} /> Execute Query
            </button>
          </div>
        </div>

        {/* Dynamic Controls per tab */}
        {activeTab === "slice" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Slice Dimension
              </label>
              <select
                value={sliceDim}
                onChange={(e) => setSliceDim(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
              >
                <option value="main_category">main_category</option>
                <option value="rating_bucket">rating_bucket</option>
                <option value="discount_bucket">discount_bucket</option>
                <option value="price_bucket">price_bucket</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Slice Equality Value
              </label>
              <input
                type="text"
                value={sliceVal}
                onChange={(e) => setSliceVal(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                placeholder="e.g. Computers&Accessories, 4.3 - 5.0, 40 - 60%"
              />
            </div>
          </div>
        )}

        {activeTab === "dice" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={diceCategory}
                onChange={(e) => setDiceCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
              >
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Min Rating (★)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={diceMinRating}
                onChange={(e) => setDiceMinRating(parseFloat(e.target.value))}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Min Discount (%)</label>
              <input
                type="number"
                min="0"
                max="90"
                value={diceMinDiscount}
                onChange={(e) => setDiceMinDiscount(parseFloat(e.target.value))}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Max Price (₹)</label>
              <input
                type="number"
                value={diceMaxPrice}
                onChange={(e) => setDiceMaxPrice(parseFloat(e.target.value))}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>
        )}

        {activeTab === "rollup" && (
          <div className="text-xs max-w-sm">
            <label className="block font-semibold text-gray-700 mb-1">
              Roll-Up Grouping Level
            </label>
            <select
              value={rollupLevel}
              onChange={(e) => setRollupLevel(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
            >
              <option value="main_category">Main Category (Department Summary)</option>
              <option value="rating_bucket">Rating Bucket Summary</option>
              <option value="discount_bucket">Discount Bucket Summary</option>
              <option value="price_bucket">Price Bucket Summary</option>
            </select>
          </div>
        )}

        {activeTab === "drilldown" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Select Department to Drill Down
              </label>
              <select
                value={drillCategory}
                onChange={(e) => {
                  setDrillCategory(e.target.value);
                  setDrillSubCat("");
                }}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
              >
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Optional Sub-Category Drill
              </label>
              <input
                type="text"
                placeholder="Leave empty for sub-categories, or enter name for items"
                value={drillSubCat}
                onChange={(e) => setDrillSubCat(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>
        )}

        {activeTab === "pivot" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Row Dimension (Y-Axis)
              </label>
              <select
                value={pivotRow}
                onChange={(e) => setPivotRow(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
              >
                <option value="main_category">main_category</option>
                <option value="price_bucket">price_bucket</option>
                <option value="discount_bucket">discount_bucket</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Column Dimension (X-Axis)
              </label>
              <select
                value={pivotCol}
                onChange={(e) => setPivotCol(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
              >
                <option value="rating_bucket">rating_bucket</option>
                <option value="discount_bucket">discount_bucket</option>
                <option value="sales_category">sales_category</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Aggregated Measure
              </label>
              <select
                value={pivotMeasure}
                onChange={(e) => setPivotMeasure(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
              >
                <option value="product_count">Product Count</option>
                <option value="avg_price">Average Price</option>
                <option value="avg_rating">Average Rating</option>
                <option value="avg_discount">Average Discount</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Pseudo-SQL Traceability Box */}
      {result?.pseudo_sql && (
        <div className="bg-[#101828] text-gray-200 p-4 rounded-xl border border-gray-800 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5 font-bold text-blue-400">
              <Code size={14} /> Equivalent ANSI Pseudo-SQL (Display & Viva Trace Only)
            </span>
            <span className="text-[11px] text-gray-500">
              Rows Affected: {result.rows_affected ?? (result.data?.length || 0)}
            </span>
          </div>
          <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-1">
            {result.pseudo_sql}
          </pre>
        </div>
      )}

      {/* Results View */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center justify-between">
          <span>{result?.operation || "OLAP Cube Execution Result"}</span>
          <span className="text-xs font-normal text-gray-500">
            {result?.data?.length || result?.table_data?.length || 0} rows returned
          </span>
        </h2>

        {loading ? (
          <LoadingSpinner message="Aggregating warehouse cube dimensions..." />
        ) : error ? (
          <ErrorState error={error} onRetry={executeOperation} />
        ) : activeTab === "pivot" ? (
          // Pivot Table & Heatmap
          <div className="space-y-6">
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 uppercase text-gray-700 font-semibold border-b">
                  <tr>
                    <th className="p-3 border-r bg-gray-100">Dimension</th>
                    {result?.col_headers?.map((ch) => (
                      <th key={ch} className="p-3 text-center border-r">
                        {ch}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {result?.table_data?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="p-3 font-sans font-semibold text-gray-900 border-r bg-gray-50/40">
                        {row.row_dimension}
                      </td>
                      {result?.col_headers?.map((ch) => (
                        <td key={ch} className="p-3 text-center border-r tabular-nums">
                          {row[ch] !== undefined ? row[ch] : 0}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 2D Heatmap Matrix */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Density Heatmap (Normalized Intensity)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {result?.heatmap_data?.map((cell, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: `rgba(37, 99, 235, ${Math.max(0.08, cell.intensity)})`,
                      color: cell.intensity > 0.5 ? "#FFFFFF" : "#1E293B",
                    }}
                    className="p-3 rounded-lg border border-blue-200/50 text-xs text-center flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-medium opacity-80 truncate">
                      {cell.row} × {cell.col}
                    </span>
                    <span className="text-base font-extrabold tabular-nums mt-1">
                      {cell.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Standard Table View (Slice, Dice, Rollup, Drilldown)
          <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[420px]">
            <table className="w-full text-xs text-left text-gray-700">
              <thead className="bg-gray-50 text-gray-900 uppercase font-semibold sticky top-0 border-b">
                <tr>
                  {result?.data && result.data.length > 0 ? (
                    Object.keys(result.data[0]).map((col) => (
                      <th key={col} className="p-3 whitespace-nowrap">
                        {col}
                      </th>
                    ))
                  ) : (
                    <th className="p-3">Result</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {result?.data?.map((row, r_i) => (
                  <tr key={r_i} className="hover:bg-gray-50">
                    {Object.values(row).map((val, c_i) => (
                      <td key={c_i} className="p-3 whitespace-nowrap tabular-nums">
                        {typeof val === "number" ? val.toLocaleString() : String(val)}
                      </td>
                    ))}
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
