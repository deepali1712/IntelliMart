import { BookOpen, CheckCircle, HelpCircle, ShieldCheck, Code, Layers, Cpu } from "lucide-react";

export default function AdminDocs() {
  const vivaQuestions = [
    {
      q: "1. Why is this project described as an analytical Data Warehouse rather than an OLTP transactional database?",
      a: "Because the core data structure is an analytical multi-dimensional cube optimized for read-heavy aggregations (Slice, Dice, Roll-Up, Drill-Down, Pivot) rather than high-frequency row inserts. The raw dataset was extracted, cleaned of currency symbols and non-numeric artifacts, and denormalized into continuous measures and hierarchical category dimensions.",
    },
    {
      q: "2. How did you ensure data hygiene and prevent target leakage during classification preprocessing?",
      a: "The Naïve Bayes classification target is rating_tier (High ≥ 4.2 vs Low < 4.2). The feature vector comprises actual_price, discount_percentage, discounted_price, and frequency-encoded category. Rating values (rating, rating_count, rating_bucket) were strictly excluded from the feature space. All StandardScaler transformations and category frequencies were fit strictly on the 70% training split, preventing test data leakage.",
    },
    {
      q: "3. What is the distinction between 'Co-Review Associations' and 'Market Basket Purchases' in your Apriori analysis?",
      a: "Academic integrity contract: the dataset contains verified user reviews ('user_id'), not sales checkout receipts. By identifying 1,304 users who evaluated multiple products (911 multi-item baskets), Apriori mines cross-category reviewer affinity (co-evaluation) rather than co-purchase. Claiming these are purchase baskets would misrepresent the data.",
    },
    {
      q: "4. Why is the Linear Regression R² score modest (~0.09)? Is the model broken?",
      a: "No, the model is academically honest. An R² of ~0.09 accurately proves that discount depth alone weakly explains customer review volume (log1p(rating_count)). Review count in real commerce is driven by brand equity, advertising budget, and product release date, none of which exist as features in this catalog crawl. Fabricating a 95% R² would constitute academic fraud.",
    },
    {
      q: "5. How does the Content-Based Recommender generate explainable recommendations?",
      a: "A 5,000-dimension TF-IDF vectorizer converts product names, categories, and descriptions into term weight vectors. Cosine similarity calculates dot products between vectors. Explainability is achieved by finding the top non-zero shared TF-IDF product terms between the seed and recommended items (e.g. 'Shared keywords: usb-c, braided, charging').",
    },
    {
      q: "6. Why does VADER run at the product level rather than naive comma-split reviews?",
      a: "Amazon review content contains natural English sentences with internal commas (e.g. 'I bought this, but it arrived late'). Splitting on commas corrupts text alignment and produces nonsensical fragments. Aggregating title and review content at product level yields mathematically sound VADER compound polarity scores.",
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
          Viva Defense Preparation
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
          DWM System Documentation & Viva Defense Guide
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl">
          Comprehensive project manual, algorithm specifications, data dictionary,
          and external examiner defense Q&A.
        </p>
      </div>

      {/* Architecture & Stack Overview */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Layers size={18} className="text-blue-600" />
          Technical Stack & Data Pipeline
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-700">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">Backend & Analytics</span>
            <ul className="space-y-1 text-gray-600">
              <li>• Python 3.12 / Flask 3.0 REST API</li>
              <li>• Pandas 2.2 / NumPy 1.26 analytical frame</li>
              <li>• Scikit-Learn 1.4 (Naïve Bayes, K-Means, OLS)</li>
              <li>• NLTK VADER Lexicon analyzer</li>
              <li>• Mlxtend 0.23 (Apriori & Association Rules)</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">Frontend Client</span>
            <ul className="space-y-1 text-gray-600">
              <li>• React 18 / Vite 5 dev server</li>
              <li>• Tailwind CSS v3.4 curated tokens</li>
              <li>• Recharts 2.15 data visualization</li>
              <li>• Lucide React icons</li>
              <li>• Axios with envelope interceptor</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">Data Warehouse Cube</span>
            <ul className="space-y-1 text-gray-600">
              <li>• Raw Source: 1,465 Amazon rows (16 cols)</li>
              <li>• Cleaned Analytical Fact: 1,465 rows (24 cols)</li>
              <li>• 3 Hierarchical category dimension levels</li>
              <li>• 3 Engineered ordinal bucket dimensions</li>
              <li>• 5 Continuous numerical measures</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Viva Defense Q&A Accordion */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle size={18} className="text-amber-500" />
          Viva Examiner Q&A Guide (Defense Strategy)
        </h2>

        <div className="space-y-3">
          {vivaQuestions.map((vq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1.5"
            >
              <h3 className="font-bold text-xs text-gray-900 flex items-start gap-2">
                <span className="text-blue-600 font-extrabold">{vq.q}</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed pl-4 border-l-2 border-blue-200">
                {vq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
