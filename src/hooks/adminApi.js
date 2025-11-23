import api from '../api/axios';

export const adminApi = {
    dashboard: () => api.get('/admin/dashboard'),
    vendors: (params) => api.get('/admin/vendors', { params }),
    vendorGet: (id) => api.get(`/admin/vendors/${id}`),
    vendorUpdate: (id, data) => api.put(`/admin/vendors/${id}`, data),
    vendorDelete: (id) => api.delete(`/admin/vendors/${id}`),

    products: (params) => api.get('/admin/products', { params }),
    productUpdate: (id, data) => api.put(`/admin/products/${id}`, data),
    productDelete: (id) => api.delete(`/admin/products/${id}`),
    productApprove: (id) => api.post(`/admin/products/${id}/approve`),
    productReject: (id, reason) => api.post(`/admin/products/${id}/reject`, { reason }),

    orders: (params) => api.get('/admin/orders', { params }),
    orderUpdate: (id, data) => api.put(`/admin/orders/${id}`, data),
    orderRefund: (id, data) => api.post(`/admin/orders/${id}/refund`, data),

    users: (params) => api.get('/admin/users', { params }),
    userSuspend: (id) => api.put(`/admin/users/${id}/suspend`),
    userDelete: (id) => api.delete(`/admin/users/${id}`),

    transactions: (params) => api.get('/admin/transactions', { params }),
    payouts: () => api.get('/admin/payouts'),

    settingsGet: () => api.get('/admin/settings'),
    settingsUpdate: (data) => api.put('/admin/settings', data),
};
