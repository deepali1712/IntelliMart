import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
  timeout: 15000,
});

// Interceptor to unwrap {data, meta, error} envelope cleanly
API.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data !== undefined) {
      return {
        ...response,
        data: response.data.data,
        meta: response.data.meta,
        error: response.data.error,
      };
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// System Health
export const fetchHealth = async () => (await API.get("/health")).data;

// Storefront & Catalog
export const fetchProducts = async (params = {}) => {
  let query = "";
  if (typeof params === "string") {
    query = `?category=${params}`;
  } else {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "" && v !== "All") {
        q.append(k, v);
      }
    });
    query = q.toString() ? `?${q.toString()}` : "";
  }
  const res = await API.get(`/products${query}`);
  return {
    products: res.data?.products || res.data || [],
    categories: res.data?.categories || [],
    meta: res.meta || {},
  };
};

export const fetchProductDetails = async (id) =>
  (await API.get(`/products/${id}`)).data;

export const fetchCategories = async () =>
  (await API.get("/categories")).data;

// Recommendations
export const fetchRecommendations = async (productId, limit = 5) =>
  (await API.get(`/products/${productId}/recommendations?limit=${limit}`)).data;

export const fetchTextRecommendations = async (q, limit = 5) =>
  (await API.get(`/recommendations/search?q=${encodeURIComponent(q)}&limit=${limit}`)).data;

// Sentiment
export const fetchProductSentiment = async (productId) =>
  (await API.get(`/sentiment/${productId}`)).data;

export const fetchSentiment = fetchProductSentiment; // alias

export const fetchSentimentSummary = async (category = "All") =>
  (await API.get(`/analytics/sentiment?category=${category}`)).data;

export const fetchSentimentByCategory = async () =>
  (await API.get("/analytics/sentiment/by-category")).data;

export const fetchSentimentReviews = async (category = "All") =>
  (await API.get(`/analytics/sentiment/reviews?category=${category}`)).data;

// Dataset Explorer
export const fetchDatasetSummary = async () =>
  (await API.get("/dataset/summary")).data;

export const fetchDatasetColumns = async () =>
  (await API.get("/dataset/columns")).data;

export const fetchDatasetPreview = async (params = {}) => {
  const q = new URLSearchParams(params).toString();
  const res = await API.get(`/dataset/preview?${q}`);
  return {
    items: res.data || [],
    meta: res.meta || {},
  };
};

// OLAP Operations
export const performOlapSlice = async (dimension, value) =>
  (await API.post("/olap/slice", { dimension, value })).data;

export const performOlapDice = async (conditions) =>
  (await API.post("/olap/dice", conditions)).data;

export const performOlapRollup = async (level = "main_category", category = "All") =>
  (await API.post("/olap/rollup", { level, category })).data;

export const performOlapDrilldown = async (category, sub_category = null) =>
  (await API.post("/olap/drilldown", { category, sub_category })).data;

export const performOlapPivot = async (row_dim, col_dim, measure) =>
  (await API.post("/olap/pivot", { row_dim, col_dim, measure })).data;

export const performOlapOperation = async (payload) =>
  (await API.post("/admin/olap", payload)).data;

// Machine Learning
export const fetchClassificationEval = async () =>
  (await API.get("/models/classification/evaluation")).data;

export const predictClassification = async (payload) =>
  (await API.post("/models/classification/predict", payload)).data;

export const fetchClusteringSummary = async (k = 3) =>
  (await API.get(`/models/clustering/summary?k=${k}`)).data;

export const runClustering = async (payload) =>
  (await API.post("/models/clustering/run", payload)).data;

export const fetchRegressionEval = async () =>
  (await API.get("/models/regression/evaluation")).data;

export const predictRegression = async (payload) =>
  (await API.post("/models/regression/predict", payload)).data;

export const fetchAssociationRules = async (payload = {}) =>
  (await API.post("/analytics/association-rules", payload)).data;

// Backward Compatibility Aliases for existing components
export const fetchAdminMetrics = async (cat = "All") =>
  (await API.get(`/admin/metrics?category=${cat}`)).data;

export const fetchClusters = async (cat = "All") =>
  (await API.get(`/admin/clusters?category=${cat}`)).data;

export const fetchSentimentData = async (cat = "All") =>
  (await API.get(`/admin/sentiment?category=${cat}`)).data;

export const fetchRegressionData = async (cat = "All") =>
  (await API.get(`/admin/regression?category=${cat}`)).data;

export const fetchAprioriRules = async (cat = "All") =>
  (await API.get(`/admin/apriori?category=${cat}`)).data;

export const predictSuccess = async (data) =>
  (await API.post("/admin/predict", data)).data;

export default API;
