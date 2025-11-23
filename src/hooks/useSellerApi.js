import api from '../api/axios';


export const sellerApi = {
    dashboard: () => api.get('/seller/dashboard'),
    products: (params) => api.get('/seller/products', { params }),
    productCreate: (data) => api.post('/seller/products', data),
    productUpdate: (id, data) => api.put(`/seller/products/${id}`, data),
    productDelete: (id) => api.delete(`/seller/products/${id}`),
    orders: (params) => api.get('/seller/my-orders', { params }),
    orderUpdateStatus: (id, orderStatus) => api.put(`/seller/orders/${id}/status`, { orderStatus }),
    earnings: () => api.get('/seller/earnings'),
    profile: () => api.get('/seller/profile'),
    profileUpdate: (data) => api.put('/seller/profile', data),
    reviews: () => api.get('/seller/reviews'),
    notifications: () => api.get('/seller/notifications'),
};