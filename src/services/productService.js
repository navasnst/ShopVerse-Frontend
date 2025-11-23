
import api from '../api/axios';

const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  addProduct: (formData, token) =>
    api.post('/products', formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }),
  updateProduct: (id, formData, token) =>
    api.put(`/products/${id}`, formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default productService;
