import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  LayoutDashboard,
  Sparkles,
  X,
  Menu,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Navbar({ onScrollToRecommendations }) {
  const { state, dispatch } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPopping, setIsPopping] = useState(false);

  // Trigger pop animation when cartCount changes
  useEffect(() => {
    if (state.cartCount > 0) {
      setIsPopping(true);
      const timer = setTimeout(() => setIsPopping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [state.cartCount]);

  const handleSearchChange = (e) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (state.searchQuery.trim()) {
      dispatch({ type: "SET_STORE_TAB", payload: "catalog" });
    }
  };

  const handleClearSearch = () => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: "" });
  };

  const navLinks = [
    { id: "storefront", label: "Storefront" },
    { id: "catalog", label: "Catalog" },
    { id: "recommendations", label: "Recommendations" },
    { id: "about", label: "About & Data" },
  ];

  const handleNavClick = (tabId) => {
    setMobileMenuOpen(false);
    if (tabId === "recommendations") {
      dispatch({ type: "SET_STORE_TAB", payload: "storefront" });
      setTimeout(() => {
        if (onScrollToRecommendations) onScrollToRecommendations();
      }, 50);
    } else {
      dispatch({ type: "SET_STORE_TAB", payload: tabId });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f051d]/85 backdrop-blur-xl border-b border-white/10 text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Logo text IntelliMart (White Intelli, Hot Pink Mart) + tiny spark */}
          <button
            onClick={() => handleNavClick("storefront")}
            className="flex items-center gap-1.5 focus:outline-none text-left group"
            aria-label="IntelliMart Home"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-glow to-hot-pink flex items-center justify-center text-white shadow-sm shadow-pink-500/30 group-hover:scale-105 transition-transform">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight">
              <span className="text-white">Intelli</span>
              <span className="text-hot-pink">Mart</span>
            </span>
          </button>

          {/* Center: Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md mx-4 relative"
          >
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={state.searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-white/10 text-sm text-gray-100 placeholder-gray-400 pl-10 pr-9 py-2 rounded-full border border-white/15 focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon/30 transition shadow-inner"
              aria-label="Search catalog"
            />
            <Search size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
            {state.searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 text-gray-400 hover:text-white transition"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </form>

          {/* Navigation Links (Storefront, Catalog, Recommendations, About & Data) */}
          <nav className="hidden lg:flex items-center space-x-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive =
                link.id === "recommendations" ? false : state.storeTab === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-blue-royal text-white shadow-md shadow-indigo-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons: Cart + DWM Center */}
          <div className="flex items-center gap-3">
            {/* Cart Button with Hot Pink Badge */}
            <button
              onClick={() => dispatch({ type: "OPEN_CART" })}
              className="relative p-2 text-gray-300 hover:text-white rounded-xl hover:bg-white/5 transition flex items-center gap-1.5"
              aria-label={`Open shopping cart with ${state.cartCount} items`}
            >
              <ShoppingBag size={20} className="text-gray-200" />
              <span className="hidden sm:inline text-xs font-bold text-gray-300">Cart</span>

              {state.cartCount > 0 && (
                <span
                  className={`bg-hot-pink text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-pink-500/40 ${
                    isPopping ? "animate-badge-pop" : ""
                  }`}
                >
                  {state.cartCount}
                </span>
              )}
            </button>

            {/* DWM Center Button with purple->pink gradient and LayoutDashboard icon */}
            <button
              onClick={() => dispatch({ type: "SET_VIEW", payload: "dwm" })}
              className="btn-cta-gradient text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="Switch to DWM Center Workstation"
            >
              <LayoutDashboard size={15} />
              <span className="hidden sm:inline">DWM Center</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar when collapsed */}
        <div className="md:hidden pb-3 pt-1">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={state.searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-white/10 text-xs text-gray-100 placeholder-gray-400 pl-9 pr-8 py-2 rounded-full border border-white/15 focus:outline-none focus:border-cyan-neon"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            {state.searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-2.5 text-gray-400"
              >
                <X size={14} />
              </button>
            )}
          </form>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0d041a] border-t border-white/10 px-2 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  state.storeTab === link.id
                    ? "bg-blue-royal text-white"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
