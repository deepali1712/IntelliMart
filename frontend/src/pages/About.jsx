import { Database, ShieldCheck, Cpu, Layers, BookOpen } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
          University DWM Capstone Project
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900">
          About IntelliMart & The DWM Intelligence Center
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          IntelliMart bridges modern e-commerce user experience with a rigorous, university-grade
          Data Warehousing & Data Mining (DWM) analytical engine. The platform demonstrates real-time
          OLAP multi-dimensional querying, supervised classification, unsupervised clustering,
          rule-based NLP sentiment analysis, and market-basket association rule mining.
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm space-y-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit">
            <Database size={20} />
          </div>
          <h2 className="text-base font-bold text-gray-900">1. Data Warehouse & OLAP Cube</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            The dataset is structured into an analytical multidimensional cube with dimension hierarchies
            (Category → Sub-Category) and engineered ordinal buckets (Price, Discount, and Rating Buckets).
            Supports interactive Slicing, Dicing, Roll-Up, Drill-Down, and 2D Pivoting with pseudo-SQL traceability.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm space-y-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg w-fit">
            <Cpu size={20} />
          </div>
          <h2 className="text-base font-bold text-gray-900">2. Mining & Predictive Analytics</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Features Gaussian Naïve Bayes for Rating Tier classification with stratified train/test isolation,
            K-Means clustering with feature standardization and automated centroid z-score interpretation,
            and Linear Regression modeling review volume against discount depth.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm space-y-2">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg w-fit">
            <Layers size={20} />
          </div>
          <h2 className="text-base font-bold text-gray-900">3. Apriori Co-Review Associations</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Identifies frequent itemsets from 1,304 multi-product reviewer profiles (911 multi-item baskets)
            using the Apriori algorithm. Clearly distinguishes between reviewer co-evaluation behavior
            and purchase transactions to uphold academic integrity.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm space-y-2">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg w-fit">
            <ShieldCheck size={20} />
          </div>
          <h2 className="text-base font-bold text-gray-900">4. The Honesty Contract</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Every metric on screen is computed dynamically from real dataset operations or trained scikit-learn models.
            No fake metrics, no synthetic accuracies, and zero arithmetic target leakage during preprocessing.
          </p>
        </div>
      </div>

      {/* Dataset & ETL Summary Table */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200/80 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <BookOpen size={18} className="text-blue-600" />
          Dataset Specification & ETL Transformations
        </h2>
        <div className="overflow-x-auto text-xs text-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-900">
                <th className="p-3">Field</th>
                <th className="p-3">Raw Type</th>
                <th className="p-3">ETL Transformation</th>
                <th className="p-3">Engineered Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-3 font-semibold">Prices (actual & discounted)</td>
                <td className="p-3 font-mono text-gray-500">object ('₹1,099')</td>
                <td className="p-3">Stripped '₹' and commas, parsed to float continuous arrays.</td>
                <td className="p-3">Continuous OLAP measure and ML feature.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">discount_percentage</td>
                <td className="p-3 font-mono text-gray-500">object ('64%')</td>
                <td className="p-3">Stripped '%' symbol, parsed to numeric float.</td>
                <td className="p-3">Engineered into discount buckets [0-20%, 20-40%, etc.].</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">rating & rating_count</td>
                <td className="p-3 font-mono text-gray-500">object (has '|' character)</td>
                <td className="p-3">Coerced errors to NaN, imputed using training median.</td>
                <td className="p-3">Continuous metric and log1p regression target.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">category</td>
                <td className="p-3 font-mono text-gray-500">pipe-separated string</td>
                <td className="p-3">Parsed into main_category, sub_category, and leaf levels.</td>
                <td className="p-3">OLAP dimension hierarchy for Roll-Up and Drill-Down.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
