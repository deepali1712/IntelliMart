import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartSubtotal, cartCount } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center max-w-lg mx-auto my-12 shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <ShoppingBag size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          You haven't added any products to your demo shopping cart yet. Browse the catalog to try out the cart functionality.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          Browse Catalog <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-900">
        <AlertTriangle size={20} className="text-amber-600 shrink-0" />
        <div className="text-xs">
          <span className="font-bold block">Academic Demo Cart Notice:</span>
          This shopping cart is a client-side prototype persisted in your browser's localStorage. No real financial checkout, payment processing, or order placement occurs.
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Shopping Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
        >
          <Trash2 size={13} /> Clear Entire Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Cart Items Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {cartItems.map((item) => {
              const price = item.discounted_price || item.discounted_price_clean || 0;
              const subtotal = price * item.quantity;

              return (
                <div
                  key={item.product_id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.img_link}
                      alt={item.product_name}
                      className="w-16 h-16 object-contain bg-gray-50 rounded p-1 border border-gray-100 shrink-0"
                    />
                    <div>
                      <Link
                        to={`/products/${item.product_id}`}
                        className="text-xs sm:text-sm font-bold text-gray-900 hover:text-blue-600 transition line-clamp-1"
                      >
                        {item.product_name}
                      </Link>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        {item.main_category || item.primary_category}
                      </span>
                      <span className="text-xs font-semibold text-gray-800 tabular-nums mt-1 block">
                        ₹{Number(price).toLocaleString()} each
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="px-2.5 py-0.5 text-xs text-gray-600 hover:bg-gray-100 rounded-l-lg"
                      >
                        -
                      </button>
                      <span className="px-3 py-0.5 text-xs font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="px-2.5 py-0.5 text-xs text-gray-600 hover:bg-gray-100 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 tabular-nums block">
                        ₹{Number(subtotal).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-[11px] text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
            Order Summary
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Total ({cartCount}):</span>
              <span className="font-semibold text-gray-900 tabular-nums">
                ₹{Number(cartSubtotal).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Shipping:</span>
              <span className="font-semibold text-emerald-600">₹0 (Academic Demo)</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Taxes:</span>
              <span className="font-semibold text-emerald-600">Included</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
            <span className="text-sm font-bold text-gray-900">Subtotal</span>
            <span className="text-2xl font-extrabold text-gray-900 tabular-nums">
              ₹{Number(cartSubtotal).toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => alert("Demo Mode: Checkout is disabled for this academic project.")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Proceed to Demo Checkout
          </button>

          <div className="text-center">
            <Link
              to="/products"
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
