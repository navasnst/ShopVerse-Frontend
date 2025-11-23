import api from '../api/axios';

const paymentService = {
  createPaymentIntent: (data) => api.post('/payment', data),
  verifyPayment: (data) => api.post('/payment/verify', data),
};

export default paymentService;
