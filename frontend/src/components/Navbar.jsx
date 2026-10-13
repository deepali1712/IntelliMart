import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, BarChart3, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate("/products");
    }
  };

  const navLinks = [
    { name: "Storefront", path: "/" },
    { name: "Catalog", path: "/products" },
    { name: "Recommendations", path: "/recommendations" },
    { name: "About & Data", path: "/about" },
  ];

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-40 bg-[#101828] text-white border-b border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm group-hover:bg-blue-500 transition">
                IM
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                IntelliMart<span className="text-blue-400">.</span>
              </span>
            </Link>
          </div>

          {/* Search bar (Storefront only) */}
          {!isAdmin && (
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center flex-1 max-w-md mx-4 relative"
            >
              <input
                type="text"
                placeholder="Search products, brands, or categories..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-gray-900/90 text-sm text-gray-200 placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              <Search
                size={16}
                className="absolute left-3 text-gray-400 pointer-events-none"
              />
            </form>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    active
                      ? "text-blue-400 bg-gray-800/60"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/40"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-1.5"
              title="View Cart"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline text-xs font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Admin Portal Toggle */}
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition ${
                isAdmin
                  ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                  : "bg-gray-900 text-blue-400 border-gray-700 hover:border-blue-500 hover:text-blue-300"
              }`}
            >
              <BarChart3 size={15} />
              <span>DWM Center</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-gray-800 px-4 pt-3 pb-5 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-gray-800 text-sm text-gray-200 placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </form>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? "text-blue-400 bg-gray-800"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
