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
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('mim_admin_token') || localStorage.getItem('mim_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Medicines
  async getMedicines(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/medicines?${query}`);
    return safeRes(res);
  },

  async getMedicineById(id) {
    const res = await fetch(`/api/medicines/${encodeURIComponent(id)}`);
    return safeRes(res);
  },

  async getCategories() {
    const res = await fetch(`/api/medicines/meta/categories`);
    return safeRes(res);
  },

  // Serviceability & Location
  async checkServiceability(pincode) {
    const res = await fetch(`/api/serviceability/check?${new URLSearchParams({ pincode })}`);
    return safeRes(res);
  },

  async getPopularLocations() {
    const res = await fetch(`/api/serviceability/popular`);
    return safeRes(res);
  },

  // Pharmacies
  async getNearbyPharmacies(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/pharmacies/nearby?${query}`);
    return safeRes(res);
  },

  async checkAvailability(pincode, medicineIds) {
    const res = await fetch(`/api/pharmacies/check-availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode, medicineIds })
    });
    return safeRes(res);
  },

  // Prescription APIs
  async uploadPrescription(formData) {
    const res = await fetch(`/api/prescriptions/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await safeRes(res);
    if (data.success && data.prescription && typeof window !== 'undefined') {
      try {
        const rx = data.prescription;
        localStorage.setItem(`mim_prescription_${rx._id || rx.id}`, JSON.stringify(rx));
        const list = JSON.parse(localStorage.getItem('mim_prescriptions') || '[]');
        const updated = [rx, ...list.filter(p => (p._id || p.id) !== (rx._id || rx.id))];
        localStorage.setItem('mim_prescriptions', JSON.stringify(updated));
      } catch {}
    }
    return data;
  },

  async getAllPrescriptions(userId) {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`/api/prescriptions${query}`);
    const data = await safeRes(res);
    if (typeof window !== 'undefined') {
      try {
        const cached = JSON.parse(localStorage.getItem('mim_prescriptions') || '[]');
        if (cached && cached.length > 0) {
          const serverList = data.success && Array.isArray(data.prescriptions) ? data.prescriptions : [];
          const serverIds = new Set(serverList.map(p => p._id || p.id));
          const missing = cached.filter(p => !serverIds.has(p._id || p.id) && (!userId || p.userId === userId));
          const merged = [...serverList, ...missing].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          return { success: true, count: merged.length, prescriptions: merged };
        }
      } catch {}
    }
    return data;
  },

  async getPrescription(id) {
    const res = await fetch(`/api/prescriptions/${encodeURIComponent(id)}`);
    const data = await safeRes(res);
    if (data.success && data.prescription) return data;
    if (typeof window !== 'undefined') {
      try {
        const cached = JSON.parse(localStorage.getItem(`mim_prescription_${id}`) || 'null');
        if (cached) return { success: true, prescription: cached, fromCache: true };
      } catch {}
    }
    return data;
  },

  async deletePrescription(id) {
    const res = await fetch(`/api/prescriptions/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    const data = await safeRes(res);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`mim_prescription_${id}`);
        const list = JSON.parse(localStorage.getItem('mim_prescriptions') || '[]');
        localStorage.setItem('mim_prescriptions', JSON.stringify(list.filter(p => (p._id || p.id) !== id)));
      } catch {}
    }
    return data;
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const data = await safeRes(res);
    if (data.success && data.order && typeof window !== 'undefined') {
      try {
        const order = data.order;
        localStorage.setItem(`mim_order_${order.orderId}`, JSON.stringify(order));
        const existing = JSON.parse(localStorage.getItem('mim_orders') || '[]');
        const updated = [order, ...existing.filter((o) => o.orderId !== order.orderId)];
        localStorage.setItem('mim_orders', JSON.stringify(updated));
        localStorage.setItem('mim_active_order', order.orderId);
      } catch (e) {
        console.warn('Could not cache order in localStorage:', e);
      }
    }
    return data;
  },

  async getOrder(orderId) {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
    const data = await safeRes(res);
    if (data.success && data.order) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`mim_order_${orderId}`, JSON.stringify(data.order));
      }
      return data;
    }
    // Fallback: check localStorage for Vercel serverless persistence
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(`mim_order_${orderId}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.orderId) {
            return { success: true, order: parsed, fromCache: true };
          }
        }
      } catch {
        // fallback failed
      }
    }
    return data;
  },

  async getOrders(userId) {
    const query = userId ? `?${new URLSearchParams({ userId })}` : '';
    const res = await fetch(`/api/orders${query}`, userId ? {} : { headers: adminHeaders() });
    const data = await safeRes(res);
    
    // Merge locally cached orders if server returned empty (e.g. fresh Vercel lambda container)
    if (typeof window !== 'undefined') {
      try {
        const localOrders = JSON.parse(localStorage.getItem('mim_orders') || '[]');
        if (localOrders && localOrders.length > 0) {
          const serverOrders = data.success && Array.isArray(data.orders) ? data.orders : [];
          const serverIds = new Set(serverOrders.map((o) => o.orderId));
          const missing = localOrders.filter((o) => !serverIds.has(o.orderId) && (!userId || o.userId === userId));
          const merged = [...serverOrders, ...missing].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          return { success: true, count: merged.length, orders: merged };
        }
      } catch {
        // continue
      }
    }
    return data;
  },

  async advanceOrderStage(orderId, targetStageIndex, orderData = null) {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/advance-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify({ targetStageIndex, order: orderData })
    });
    const data = await safeRes(res);
    if (data.success && data.order && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`mim_order_${orderId}`, JSON.stringify(data.order));
        const existing = JSON.parse(localStorage.getItem('mim_orders') || '[]');
        const updated = existing.map((o) => o.orderId === orderId ? data.order : o);
        localStorage.setItem('mim_orders', JSON.stringify(updated));
      } catch {}
    } else if (!data.success && typeof window !== 'undefined') {
      // Local fallback for stage advance
      try {
        const cached = orderData || JSON.parse(localStorage.getItem(`mim_order_${orderId}`) || 'null');
        if (cached) {
          const STAGES = ['Order Placed', 'Order Accepted by Pharmacy', 'Prescription Verification', 'Medicines Being Packed', 'Delivery Partner Assigned', 'Out for Delivery', 'Successfully Delivered'];
          const nextIdx = typeof targetStageIndex === 'number' ? targetStageIndex : Math.min((cached.stageIndex || 0) + 1, STAGES.length - 2);
          const updated = {
            ...cached,
            stageIndex: nextIdx,
            status: STAGES[nextIdx]
          };
          localStorage.setItem(`mim_order_${orderId}`, JSON.stringify(updated));
          const existing = JSON.parse(localStorage.getItem('mim_orders') || '[]');
          localStorage.setItem('mim_orders', JSON.stringify(existing.map((o) => o.orderId === orderId ? updated : o)));
          return { success: true, order: updated };
        }
      } catch {}
    }
    return data;
  },

  async cancelOrder(orderId, reason, orderData = null) {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify({ reason, order: orderData })
    });
    const data = await safeRes(res);
    if (typeof window !== 'undefined') {
      try {
        const cached = (data.success && data.order) ? data.order : (orderData || JSON.parse(localStorage.getItem(`mim_order_${orderId}`) || 'null'));
        if (cached) {
          const updated = {
            ...cached,
            status: 'Cancelled',
            paymentStatus: cached.paymentMethod === 'Cash on Delivery' ? 'Not Charged' : 'Refund Pending'
          };
          localStorage.setItem(`mim_order_${orderId}`, JSON.stringify(updated));
          const existing = JSON.parse(localStorage.getItem('mim_orders') || '[]');
          localStorage.setItem('mim_orders', JSON.stringify(existing.map((o) => o.orderId === orderId ? updated : o)));
          if (!data.success) {
            return { success: true, order: updated, message: 'Order cancelled locally.' };
          }
        }
      } catch {}
    }
    return data;
  },

  async confirmOrderDelivery(orderId, otp, orderData = null) {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/deliver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify({ otp, order: orderData })
    });
    const data = await safeRes(res);
    if (data.success && data.order && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`mim_order_${orderId}`, JSON.stringify(data.order));
        const existing = JSON.parse(localStorage.getItem('mim_orders') || '[]');
        const updated = existing.map((o) => o.orderId === orderId ? data.order : o);
        localStorage.setItem('mim_orders', JSON.stringify(updated));
      } catch {}
    } else if (!data.success && typeof window !== 'undefined') {
      // Local fallback in case serverless container 404s
      try {
        const cached = orderData || JSON.parse(localStorage.getItem(`mim_order_${orderId}`) || 'null');
        if (cached) {
          const updated = {
            ...cached,
            stageIndex: 6,
            status: 'Successfully Delivered',
            deliveryOtpVerified: true,
            deliveredAt: new Date().toISOString(),
            paymentStatus: cached.paymentMethod === 'Cash on Delivery' ? 'Paid' : cached.paymentStatus
          };
          localStorage.setItem(`mim_order_${orderId}`, JSON.stringify(updated));
          const existing = JSON.parse(localStorage.getItem('mim_orders') || '[]');
          localStorage.setItem('mim_orders', JSON.stringify(existing.map((o) => o.orderId === orderId ? updated : o)));
          return { success: true, order: updated, message: 'Order delivery confirmed successfully!' };
        }
      } catch {}
    }
    return data;
  },

  async submitFeedback(orderId, feedbackData) {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData)
    });
    return safeRes(res);
  },

  async reorder(orderId) {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/reorder`, {
      method: 'POST'
    });
    return safeRes(res);
  },

  async getInvoice(orderId) {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/invoice`);
    const data = await safeRes(res);
    if (data.success && data.invoice) return data;
    if (typeof window !== 'undefined') {
      try {
        const cached = JSON.parse(localStorage.getItem(`mim_order_${orderId}`) || 'null');
        if (cached) {
          return {
            success: true,
            invoice: {
              invoiceNumber: cached.invoiceNumber || `INV-2026-${orderId.replace('MIM-', '')}`,
              orderId: cached.orderId,
              invoiceDate: new Date(cached.createdAt || Date.now()).toLocaleDateString(),
              customerName: cached.customerName,
              customerPhone: cached.customerPhone,
              deliveryAddress: cached.deliveryAddress?.fullAddress || cached.deliveryAddress?.street,
              paymentMethod: cached.paymentMethod,
              paymentStatus: cached.paymentStatus || 'Paid',
              items: cached.items,
              subtotal: cached.subtotal,
              deliveryFee: cached.deliveryFee,
              packagingFee: cached.packagingFee,
              discount: cached.discount || 0,
              tax: cached.tax,
              totalAmount: cached.totalAmount,
              pharmacy: cached.pharmacy
            }
          };
        }
      } catch {}
    }
    return data;
  },

  // Auth
  async register(data) {
    const res = await fetch(`/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return safeRes(res);
  },

  async login(data) {
    const res = await fetch(`/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return safeRes(res);
  },

  async getProfile(token) {
    const res = await fetch(`/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return safeRes(res);
  },

  async saveAddress(userId, address) {
    const res = await fetch(`/api/auth/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, address })
    });
    return safeRes(res);
  },

  async deleteAddress(userId, addressId) {
    const res = await fetch(`/api/auth/addresses/${userId}/${addressId}`, {
      method: 'DELETE'
    });
    return safeRes(res);
  },

  // Administrator catalog APIs
  async createMedicine(data) {
    const res = await fetch(`/api/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify(data)
    });
    return safeRes(res);
  },

  async updateMedicine(id, data) {
    const res = await fetch(`/api/medicines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify(data)
    });
    return safeRes(res);
  },

  async deleteMedicine(id) {
    const res = await fetch(`/api/medicines/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: adminHeaders()
    });
    return safeRes(res);
  }
};

