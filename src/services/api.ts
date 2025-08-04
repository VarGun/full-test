import axios from "axios";
import type {Product} from "../types/Product.ts";

const api = axios.create({
  // .env 파일로 이동 필요, 배포시 별도 관리 필요
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
);

export const productService = {
  getAll: (): Promise<Product[]> =>
      api.get('/products').then(res => res.data),

  getById: (id: number): Promise<Product> =>
      api.get(`/products/${id}`).then(res => res.data),

  create: (data: Omit<Product, 'id'>): Promise<Product> =>
      api.post('/products', data).then(res => res.data),

  update: (id: number, data: Partial<Omit<Product, 'id'>>): Promise<Product> =>
      api.put(`/products/${id}`, data).then(res => res.data),

  delete: (id: number): Promise<void> =>
      api.delete(`/products/${id}`).then(res => res.data),
};