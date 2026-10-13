import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { FilterProvider } from "./context/FilterContext";
import Navbar from "./components/Navbar";
import AdminLayout from "./components/AdminLayout";

// Storefront Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import RecommendationsPage from "./pages/RecommendationsPage";
import Cart from "./pages/Cart";
import About from "./pages/About";

// Admin Pages
import AdminOverview from "./pages/admin/AdminOverview";
import AdminDataset from "./pages/admin/AdminDataset";
import AdminOlap from "./pages/admin/AdminOlap";
import AdminClassification from "./pages/admin/AdminClassification";
import AdminClustering from "./pages/admin/AdminClustering";
import AdminSentiment from "./pages/admin/AdminSentiment";
import AdminAssociationRules from "./pages/admin/AdminAssociationRules";
import AdminRegression from "./pages/admin/AdminRegression";
import AdminPrediction from "./pages/admin/AdminPrediction";
import AdminDocs from "./pages/admin/AdminDocs";

function StorefrontLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        {children}
      </main>
      <footer className="bg-[#101828] text-gray-400 py-8 text-xs border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white text-sm">IntelliMart</span> — Data Warehousing & Data Mining Project
            <p className="text-[11px] text-gray-500 mt-0.5">
              Powered by Kaggle Amazon Product Catalog dataset (1,465 authentic records).
            </p>
          </div>
          <div className="flex gap-4">
            <a href="/about" className="hover:text-white transition">About & Data</a>
            <a href="/admin" className="hover:text-white transition">Admin DWM Center</a>
            <a href="/admin/docs" className="hover:text-white transition">Viva Guide</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <CartProvider>
        <FilterProvider>
          <Routes>
            {/* Storefront Routes */}
            <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
            <Route path="/products" element={<StorefrontLayout><Products /></StorefrontLayout>} />
            <Route path="/products/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
            <Route path="/recommendations" element={<StorefrontLayout><RecommendationsPage /></StorefrontLayout>} />
            <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
            <Route path="/about" element={<StorefrontLayout><About /></StorefrontLayout>} />

            {/* Admin Intelligence Center Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="dataset" element={<AdminDataset />} />
              <Route path="olap" element={<AdminOlap />} />
              <Route path="classification" element={<AdminClassification />} />
              <Route path="clustering" element={<AdminClustering />} />
              <Route path="sentiment" element={<AdminSentiment />} />
              <Route path="association-rules" element={<AdminAssociationRules />} />
              <Route path="regression" element={<AdminRegression />} />
              <Route path="recommendations" element={<RecommendationsPage />} />
              <Route path="prediction" element={<AdminPrediction />} />
              <Route path="docs" element={<AdminDocs />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FilterProvider>
      </CartProvider>
    </Router>
  );
}
