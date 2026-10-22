import React from "react";
import { AppProvider, useApp } from "./context/AppContext";

// Storefront Components
import Navbar from "./components/store/Navbar";
import Hero from "./components/store/Hero";
import SmartRecommendations from "./components/store/SmartRecommendations";
import TrendingGrid from "./components/store/TrendingGrid";
import CatalogView from "./components/store/CatalogView";
import AboutData from "./components/store/AboutData";
import CartDrawer from "./components/store/CartDrawer";
import Footer from "./components/store/Footer";
import ProductDetailModal from "./components/store/ProductDetailModal";

// Common Components
import Toast from "./components/common/Toast";

// DWM Workstation Components (Ultraleads-Style)
import TopNav from "./components/dwm/TopNav";
import Overview from "./components/dwm/Overview";
import DatasetExplorer from "./components/dwm/DatasetExplorer";
import CustomDataSlicer from "./components/dwm/CustomDataSlicer";
import RatingTierClassifier from "./components/dwm/RatingTierClassifier";
import Segmentation from "./components/dwm/Segmentation";
import SentimentInsights from "./components/dwm/SentimentInsights";
import CrossSell from "./components/dwm/CrossSell";
import PriceDiscountTrends from "./components/dwm/PriceDiscountTrends";
import SalesForecaster from "./components/dwm/SalesForecaster";

function MainContent() {
  const { state } = useApp();

  const scrollToRecommendations = () => {
    const el = document.getElementById("recommendations");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased">
      {/* Toast Notification Container */}
      <Toast />

      {/* Global Shopping Cart Slide-over */}
      <CartDrawer />

      {/* Amazon/Flipkart-style Product Detail Modal */}
      <ProductDetailModal />

      {/* VIEW 1: STOREFRONT VIEW (PURPLE AMBIENT THEME) */}
      {state.view === "store" && (
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">
          {/* Top Sticky Navbar */}
          <Navbar onScrollToRecommendations={scrollToRecommendations} />

          {/* Main Content Area based on storeTab */}
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {state.storeTab === "storefront" && (
              <>
                <Hero onScrollToRecommendations={scrollToRecommendations} />
                <SmartRecommendations />
                <TrendingGrid />
              </>
            )}

            {state.storeTab === "catalog" && <CatalogView />}

            {state.storeTab === "about" && <AboutData />}
          </main>

          {/* Dark Footer */}
          <Footer />
        </div>
      )}

      {/* VIEW 2: DWM CENTER (NEW ULTRALEADS-STYLE GLASS DASHBOARD) */}
      {state.view === "dwm" && (
        <div className="min-h-screen bg-gradient-to-br from-[#e9edf3] via-[#f1f4f8] to-[#f4f7fb] py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
          {/* Large Centered Frosted Glass Dashboard Container */}
          <div className="max-w-[1440px] mx-auto rounded-[28px] bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_20px_60px_rgba(30,60,110,0.12)] overflow-hidden transition-all duration-300">
            {/* Ultraleads Top Navigation Bar */}
            <TopNav />

            {/* Dashboard Workspace Content */}
            <main className="p-4 sm:p-6 lg:p-8">
              {state.dwmSection === "overview" && <Overview />}
              {state.dwmSection === "explorer" && <DatasetExplorer />}
              {state.dwmSection === "slicer" && <CustomDataSlicer />}
              {state.dwmSection === "classifier" && <RatingTierClassifier />}
              {state.dwmSection === "segmentation" && <Segmentation />}
              {state.dwmSection === "sentiment" && <SentimentInsights />}
              {state.dwmSection === "cross-sell" && <CrossSell />}
              {state.dwmSection === "trends" && <PriceDiscountTrends />}
              {state.dwmSection === "forecaster" && <SalesForecaster />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
