import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Filter, RefreshCw } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { useFilters } from "../context/FilterContext";

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isFiltered, filteredCount, totalCatalogCount, resetFilters } = useFilters();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FB]">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-gray-800">
              DWM Intelligence Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Filter Indicator */}
            <div
              className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
                isFiltered
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              <Filter size={12} />
              <span>
                {isFiltered
                  ? `Filtered: ${filteredCount} of ${totalCatalogCount}`
                  : "Global Dataset (1,465 products)"}
              </span>
            </div>

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 font-medium transition"
                title="Reset filters"
              >
                <RefreshCw size={12} /> Clear Filter
              </button>
            )}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
