const configuredApiUrl = import.meta.env.VITE_API_URL;
const API_BASE = (configuredApiUrl || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')).replace(/\/$/, '');
export const API_ORIGIN = API_BASE.replace(/\/api$/i, '');

const safeRes = async (res) => {
  try {
    const data = await res.json();
    return data;
  } catch {
    return {
      success: false,
      status: res.status,
      message: res.statusText || 'Unable to parse server response'
    };
  }
};

const adminHeaders = () => {
  const token = localStorage.getItem('mim_admin_token') || localStorage.getItem('mim_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Medicines
  async getMedicines(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/medicines?${query}`);
    return safeRes(res);
  },

  async getMedicineById(id) {
    const res = await fetch(`${API_BASE}/medicines/${encodeURIComponent(id)}`);
    return safeRes(res);
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/medicines/meta/categories`);
    return safeRes(res);
  },

  // Serviceability & Location
  async checkServiceability(pincode) {
    const res = await fetch(`${API_BASE}/serviceability/check?${new URLSearchParams({ pincode })}`);
    return safeRes(res);
  },

  async getPopularLocations() {
    const res = await fetch(`${API_BASE}/serviceability/popular`);
    return safeRes(res);
  },

  // Pharmacies
  async getNearbyPharmacies(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/pharmacies/nearby?${query}`);
    return safeRes(res);
  },

  async checkAvailability(pincode, medicineIds) {
    const res = await fetch(`${API_BASE}/pharmacies/check-availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode, medicineIds })
    });
    return safeRes(res);
  },

  // Prescription
  async uploadPrescription(formData) {
    const res = await fetch(`${API_BASE}/prescriptions/upload`, {
      method: 'POST',
      body: formData
    });
    return safeRes(res);
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return safeRes(res);
  },

  async getOrder(orderId) {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}`);
    return safeRes(res);
  },

  async getOrders(userId) {
    const query = userId ? `?${new URLSearchParams({ userId })}` : '';
    const url = `${API_BASE}/orders${query}`;
    const res = await fetch(url, userId ? {} : { headers: adminHeaders() });
    return safeRes(res);
  },

  async advanceOrderStage(orderId, targetStageIndex) {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/advance-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify({ targetStageIndex })
    });
    return safeRes(res);
  },

  async cancelOrder(orderId, reason) {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify({ reason })
    });
    return safeRes(res);
  },

  async confirmOrderDelivery(orderId, otp) {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/deliver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify({ otp })
    });
    return safeRes(res);
  },

  async submitFeedback(orderId, feedbackData) {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData)
    });
    return safeRes(res);
  },

  async reorder(orderId) {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/reorder`, {
      method: 'POST'
    });
    return safeRes(res);
  },

  async getInvoice(orderId) {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/invoice`);
    return safeRes(res);
  },

  // Auth
  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return safeRes(res);
  },

  async login(data) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return safeRes(res);
  },

  async getProfile(token) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return safeRes(res);
  },

  async saveAddress(userId, address) {
    const res = await fetch(`${API_BASE}/auth/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, address })
    });
    return safeRes(res);
  },

  async deleteAddress(userId, addressId) {
    const res = await fetch(`${API_BASE}/auth/addresses/${userId}/${addressId}`, {
      method: 'DELETE'
    });
    return safeRes(res);
  },

  // Administrator catalog APIs
  async createMedicine(data) {
    const res = await fetch(`${API_BASE}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify(data)
    });
    return safeRes(res);
  },

  async updateMedicine(id, data) {
    const res = await fetch(`${API_BASE}/medicines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify(data)
    });
    return safeRes(res);
  },

  async deleteMedicine(id) {
    const res = await fetch(`${API_BASE}/medicines/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: adminHeaders()
    });
    return safeRes(res);
  },

  async getAllPrescriptions() {
    const res = await fetch(`${API_BASE}/prescriptions`);
    return safeRes(res);
  },

  async getPrescription(id) {
    const res = await fetch(`${API_BASE}/prescriptions/${encodeURIComponent(id)}`);
    return safeRes(res);
  },

  async verifyPrescription(id, data) {
    const res = await fetch(`${API_BASE}/prescriptions/${id}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return safeRes(res);
  },

  async getAllPharmacies() {
    const res = await fetch(`${API_BASE}/pharmacies`);
    return safeRes(res);
  },

  async updatePharmacyStatus(id, data) {
    const res = await fetch(`${API_BASE}/pharmacies/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return safeRes(res);
  }
};
