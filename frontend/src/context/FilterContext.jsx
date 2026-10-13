import { createContext, useContext, useState, useEffect } from "react";
import { fetchProducts } from "../services/api";

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [searchQuery, setSearchQuery] = useState("");

  const [availableCategories, setAvailableCategories] = useState(["All"]);
  const [filteredCount, setFilteredCount] = useState(1465);
  const [totalCatalogCount, setTotalCatalogCount] = useState(1465);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  // Update counts when filters change
  useEffect(() => {
    let isMounted = true;
    const updateStats = async () => {
      setIsLoadingCount(true);
      try {
        const res = await fetchProducts({
          category: selectedCategory,
          min_rating: minRating > 0 ? minRating : undefined,
          min_discount: minDiscount > 0 ? minDiscount : undefined,
          max_price: maxPrice < 100000 ? maxPrice : undefined,
          search: searchQuery || undefined,
          per_page: 1,
        });

        if (isMounted) {
          setFilteredCount(res.meta?.total ?? 1465);
          if (res.meta?.catalog_total) {
            setTotalCatalogCount(res.meta.catalog_total);
          }
          if (res.categories && res.categories.length > 0) {
            setAvailableCategories(["All", ...res.categories]);
          }
        }
      } catch (err) {
        console.error("Filter count update error:", err);
      } finally {
        if (isMounted) setIsLoadingCount(false);
      }
    };

    updateStats();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, minRating, minDiscount, maxPrice, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setMinRating(0);
    setMinDiscount(0);
    setMaxPrice(100000);
    setSearchQuery("");
  };

  const isFiltered =
    selectedCategory !== "All" ||
    minRating > 0 ||
    minDiscount > 0 ||
    maxPrice < 100000 ||
    searchQuery.trim().length > 0;

  return (
    <FilterContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        minRating,
        setMinRating,
        minDiscount,
        setMinDiscount,
        maxPrice,
        setMaxPrice,
        searchQuery,
        setSearchQuery,
        availableCategories,
        filteredCount,
        totalCatalogCount,
        isFiltered,
        isLoadingCount,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export const useFilters = () => useContext(FilterContext);
