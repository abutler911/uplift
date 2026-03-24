import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3002/api";

// Public API — no auth
export const publicApi = axios.create({ baseURL: BASE });

// Admin API — attaches token
const adminApi = axios.create({ baseURL: BASE });

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("uplift_token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export default adminApi;

// ─── Public ───
export const getPosts = (params) => publicApi.get("/posts/public", { params });
export const getPost = (slug) => publicApi.get(`/posts/public/${slug}`);

// ─── Admin ───
export const adminLogin = (passphrase) =>
  adminApi.post("/auth/login", { passphrase });
export const adminGetPosts = (params) => adminApi.get("/posts", { params });
export const adminGetPost = (id) => adminApi.get(`/posts/${id}`);
export const adminCreatePost = (data) => adminApi.post("/posts", data);
export const adminUpdatePost = (id, data) =>
  adminApi.patch(`/posts/${id}`, data);
export const adminDeletePost = (id) => adminApi.delete(`/posts/${id}`);
