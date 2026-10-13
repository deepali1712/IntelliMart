import { AlertCircle, RefreshCw, Inbox, Loader2 } from "lucide-react";

export function LoadingSpinner({ message = "Computing analytical models..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Loader2 className="w-9 h-9 text-blue-600 animate-spin mb-3" />
      <p className="text-sm font-medium text-gray-700">{message}</p>
      <p className="text-xs text-gray-400 mt-1">Processing dataset from backend...</p>
    </div>
  );
}

export function ErrorState({ error, onRetry, title = "Failed to load data" }) {
  const errMsg =
    typeof error === "string"
      ? error
      : error?.response?.data?.error?.message ||
        error?.message ||
        "An unexpected error occurred while communicating with the API.";

  return (
    <div className="bg-red-50/70 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto my-8">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-base font-bold text-red-900 mb-1">{title}</h3>
      <p className="text-xs text-red-700 mb-4 leading-relaxed">{errMsg}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <RefreshCw size={14} /> Retry Query
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title = "No products found",
  message = "Try clearing or relaxing your search filters.",
  onReset,
}) {
  return (
    <div className="bg-white border border-gray-200/70 rounded-xl p-10 text-center max-w-md mx-auto my-8 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
        <Inbox size={24} />
      </div>
      <h3 className="text-base font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 mb-4">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
