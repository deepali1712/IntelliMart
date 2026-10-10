import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Product Storefront APIs
export const fetchProducts = async (category = "All", search = "") => {
  const response = await API.get(
    `/products?category=${category}&search=${search}`,
  );
  return response.data;
};

export const fetchRecommendations = async (productId) => {
  const response = await API.get(`/recommend/${productId}`);
  return response.data;
};

export const fetchSentiment = async (productId) => {
  const response = await API.get(`/sentiment/${productId}`);
  return response.data;
};

// Admin DWM APIs (With OLAP Slicing)
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
export const performOlapOperation = async (payload) => {
  const response = await API.post("/admin/olap", payload);
  return response.data;
};
