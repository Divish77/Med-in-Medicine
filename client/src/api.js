const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Medicines
  async getMedicines(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/medicines?${query}`);
    return res.json();
  },

  async getMedicineById(id) {
    const res = await fetch(`${API_BASE}/medicines/${id}`);
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/medicines/meta/categories`);
    return res.json();
  },

  // Serviceability & Location
  async checkServiceability(pincode) {
    const res = await fetch(`${API_BASE}/serviceability/check?pincode=${pincode}`);
    return res.json();
  },

  async getPopularLocations() {
    const res = await fetch(`${API_BASE}/serviceability/popular`);
    return res.json();
  },

  // Pharmacies
  async getNearbyPharmacies(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/pharmacies/nearby?${query}`);
    return res.json();
  },

  async checkAvailability(pincode, medicineIds) {
    const res = await fetch(`${API_BASE}/pharmacies/check-availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode, medicineIds })
    });
    return res.json();
  },

  // Prescription
  async uploadPrescription(formData) {
    const res = await fetch(`${API_BASE}/prescriptions/upload`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  async getOrder(orderId) {
    const res = await fetch(`${API_BASE}/orders/${orderId}`);
    return res.json();
  },

  async getOrders(userId) {
    const url = userId ? `${API_BASE}/orders?userId=${userId}` : `${API_BASE}/orders`;
    const res = await fetch(url);
    return res.json();
  },

  async advanceOrderStage(orderId, targetStageIndex) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/advance-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetStageIndex })
    });
    return res.json();
  },

  async confirmOrderDelivery(orderId, otp) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/deliver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp })
    });
    return res.json();
  },

  async submitFeedback(orderId, feedbackData) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData)
    });
    return res.json();
  },

  async reorder(orderId) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/reorder`, {
      method: 'POST'
    });
    return res.json();
  },

  async getInvoice(orderId) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/invoice`);
    return res.json();
  },

  // Auth
  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async login(data) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getProfile(token) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  async saveAddress(userId, address) {
    const res = await fetch(`${API_BASE}/auth/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, address })
    });
    return res.json();
  },

  async deleteAddress(userId, addressId) {
    const res = await fetch(`${API_BASE}/auth/addresses/${userId}/${addressId}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};
