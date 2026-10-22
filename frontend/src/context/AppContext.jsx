import React, { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext();

function calculateCartCount(cart) {
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

// Initial state parsed from URL hash or default (strictly in-memory, no localStorage/sessionStorage)
function getInitialState() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  let view = "store";
  let storeTab = "storefront";
  let dwmSection = "overview";

  if (hash.startsWith("dwm")) {
    view = "dwm";
    const parts = hash.split("/");
    if (parts[1]) dwmSection = parts[1];
  } else if (hash.startsWith("store")) {
    view = "store";
    const parts = hash.split("/");
    if (parts[1]) storeTab = parts[1];
  }

  return {
    view,
    storeTab,
    dwmSection,
    cart: [],
    cartCount: 0,
    lastAddedCategory: null,
    searchQuery: "",
    isCartOpen: false,
    selectedProduct: null, // For Amazon/Flipkart-style Product Detail Modal
    isFilterPopoverOpen: false, // For Ultraleads DWM filter popover
    toast: null,
  };
}

function appReducer(state, action) {
  switch (action.type) {
    case "SET_VIEW": {
      return {
        ...state,
        view: action.payload,
      };
    }

    case "SET_STORE_TAB": {
      return {
        ...state,
        view: "store",
        storeTab: action.payload,
      };
    }

    case "SET_DWM_SECTION": {
      return {
        ...state,
        view: "dwm",
        dwmSection: action.payload,
      };
    }

    case "SET_SEARCH_QUERY": {
      return {
        ...state,
        searchQuery: action.payload,
      };
    }

    case "OPEN_CART": {
      return { ...state, isCartOpen: true };
    }

    case "CLOSE_CART": {
      return { ...state, isCartOpen: false };
    }

    case "OPEN_PRODUCT_MODAL": {
      return { ...state, selectedProduct: action.payload };
    }

    case "CLOSE_PRODUCT_MODAL": {
      return { ...state, selectedProduct: null };
    }

    case "TOGGLE_FILTER_POPOVER": {
      return { ...state, isFilterPopoverOpen: !state.isFilterPopoverOpen };
    }

    case "CLOSE_FILTER_POPOVER": {
      return { ...state, isFilterPopoverOpen: false };
    }

    case "ADD_TO_CART": {
      const product = action.payload;
      const existingIdx = state.cart.findIndex(
        (item) => item.product.productId === product.productId
      );
      let updatedCart;

      if (existingIdx > -1) {
        updatedCart = state.cart.map((item, idx) =>
          idx === existingIdx ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...state.cart, { product, quantity: 1 }];
      }

      return {
        ...state,
        cart: updatedCart,
        cartCount: calculateCartCount(updatedCart),
        lastAddedCategory: product.category,
        toast: {
          id: Date.now(),
          message: `Added "${product.productName.slice(0, 26)}..." to cart`,
          category: product.category,
        },
      };
    }

    case "UPDATE_CART_QUANTITY": {
      const { productId, delta } = action.payload;
      const updatedCart = state.cart
        .map((item) => {
          if (item.product.productId === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean);

      return {
        ...state,
        cart: updatedCart,
        cartCount: calculateCartCount(updatedCart),
      };
    }

    case "REMOVE_FROM_CART": {
      const productId = action.payload;
      const updatedCart = state.cart.filter(
        (item) => item.product.productId !== productId
      );

      return {
        ...state,
        cart: updatedCart,
        cartCount: calculateCartCount(updatedCart),
      };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        cart: [],
        cartCount: 0,
        lastAddedCategory: null,
      };
    }

    case "CLEAR_TOAST": {
      return {
        ...state,
        toast: null,
      };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, getInitialState);

  // Sync state to URL hash
  useEffect(() => {
    const hash =
      state.view === "store"
        ? `#/store/${state.storeTab}`
        : `#/dwm/${state.dwmSection}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }, [state.view, state.storeTab, state.dwmSection]);

  // Listen to hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, "");
      if (rawHash.startsWith("dwm")) {
        const parts = rawHash.split("/");
        dispatch({ type: "SET_DWM_SECTION", payload: parts[1] || "overview" });
      } else if (rawHash.startsWith("store")) {
        const parts = rawHash.split("/");
        dispatch({ type: "SET_STORE_TAB", payload: parts[1] || "storefront" });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Auto-clear toast after 2.6s
  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => {
        dispatch({ type: "CLEAR_TOAST" });
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [state.toast]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
