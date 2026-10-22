import { CheckCircle, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Toast() {
  const { state, dispatch } = useApp();

  if (!state.toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0f051d] text-white px-4 py-3 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl animate-fade-in transition-all">
      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
        <CheckCircle size={18} />
      </div>
      <div>
        <p className="text-xs font-bold text-white">{state.toast.message}</p>
        {state.toast.category && (
          <p className="text-[10px] text-cyan-400 font-semibold uppercase mt-0.5">
            Category: {state.toast.category}
          </p>
        )}
      </div>
      <button
        onClick={() => dispatch({ type: "CLEAR_TOAST" })}
        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}
