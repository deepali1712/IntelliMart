import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { formatCurrency } from "../../utils/format";
import { useApp } from "../../context/AppContext";

export default function CartDrawer() {
  const { state, dispatch } = useApp();

  if (!state.isCartOpen) return null;

  const subtotal = state.cart.reduce(
    (sum, item) => sum + item.product.discountedPrice * item.quantity,
    0
  );

  const totalActual = state.cart.reduce(
    (sum, item) => sum + item.product.actualPrice * item.quantity,
    0
  );

  const savings = Math.max(0, totalActual - subtotal);

  const handleCheckout = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        productId: "toast-dummy",
        productName: "Demo Checkout Order Placed!",
        category: "Order Processed",
        discountedPrice: subtotal,
        actualPrice: totalActual,
        discountPercentage: 0,
        rating: 5,
        ratingCount: 1,
      },
    });
    dispatch({ type: "CLOSE_CART" });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch({ type: "CLOSE_CART" })}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 text-slate-800 animate-slide-left">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-blue-royal" />
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Your Shopping Cart
            </h2>
            <span className="text-xs bg-pink-neon/10 text-pink-neon font-black px-2 py-0.5 rounded-full">
              {state.cartCount} items
            </span>
          </div>
          <button
            onClick={() => dispatch({ type: "CLOSE_CART" })}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
            aria-label="Close cart drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {state.cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <ShoppingBag size={28} />
              </div>
              <p className="text-sm font-bold text-slate-700">Your cart is currently empty</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Discover trending items or check smart recommendations on the storefront.
              </p>
            </div>
          ) : (
            state.cart.map((item) => (
              <div
                key={item.product.productId}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex gap-3.5 items-start justify-between"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-violet-glow uppercase block tracking-wider">
                    {item.product.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                    {item.product.productName}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-black text-slate-900 tabular-nums">
                      {formatCurrency(item.product.discountedPrice)}
                    </span>
                    {item.product.actualPrice > item.product.discountedPrice && (
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        {formatCurrency(item.product.actualPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Stepper & Remove */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_FROM_CART",
                        payload: item.product.productId,
                      })
                    }
                    className="text-slate-400 hover:text-pink-neon transition"
                    title="Remove item"
                    aria-label={`Remove ${item.product.productName}`}
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-bold">
                    <button
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_CART_QUANTITY",
                          payload: { productId: item.product.productId, delta: -1 },
                        })
                      }
                      className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center tabular-nums text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_CART_QUANTITY",
                          payload: { productId: item.product.productId, delta: 1 },
                        })
                      }
                      className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {state.cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Total Savings</span>
                  <span className="tabular-nums font-bold">
                    -{formatCurrency(savings)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="tabular-nums">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 px-4 rounded-xl btn-cta-gradient text-white text-xs font-bold shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition"
            >
              <span>Checkout (Demo Simulation)</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
