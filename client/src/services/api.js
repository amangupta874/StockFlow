import axios from "axios";
import toast from "react-hot-toast";
import { getStoredToken } from "../utils/sessionStorage.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api"
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    if (error.config?.showToast !== false) toast.error(message);
    return Promise.reject(error);
  }
);

const formPayload = (payload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  return formData;
};

export const authService = {
  async login(payload) {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },
  async profile() {
    const { data } = await api.get("/auth/profile", { showToast: false });
    return data;
  },
  async register(payload) {
    const { data } = await api.post("/auth/register", payload);
    return data;
  }
};

export const productService = {
  async list(params = {}) {
    const { data } = await api.get("/products", { params, showToast: false });
    return data;
  },
  async create(payload) {
    const { data } = await api.post("/products", formPayload(payload));
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/products/${id}`, formPayload(payload));
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  }
};

export const dashboardService = {
  async stats() {
    const { data } = await api.get("/dashboard/stats", { showToast: false });
    return data;
  }
};

export default api;
