import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_ORIGIN, api } from '../api';
import { supabase, supabaseAuth } from '../supabase';

const AppContext = createContext(null);

const safeJsonParse = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    return JSON.parse(saved);
  } catch (err) {
    console.warn(`Failed to parse localStorage key "${key}":`, err);
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState('home');

  // User State
  const [user, setUser] = useState(() => {
    const savedUser = safeJsonParse('mim_user', null);
    if (savedUser && !['buyer', 'admin'].includes(savedUser.role)) {
      localStorage.removeItem('mim_user');
      localStorage.removeItem('mim_token');
      return null;
    }
    const hasLocalAdminToken = Boolean(localStorage.getItem('mim_token'));
    return savedUser ? { ...savedUser, role: savedUser.role === 'admin' && hasLocalAdminToken ? 'admin' : 'buyer' } : null;
  });

  const [pendingCartItems, setPendingCartItems] = useState([]);
  const [cartLoadedForUserId, setCartLoadedForUserId] = useState(user?.id || null);

  // Saved Delivery Addresses (Home, Work, Other)
  const [savedAddresses, setSavedAddresses] = useState(() => safeJsonParse('mim_addresses', []));

  // Current Selected Delivery Location
  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    return safeJsonParse('mim_location', {
      pincode: '', area: '', city: '', street: '', landmark: '', fullAddress: '',
      label: '', lat: null, lng: null, expressEligible: false, etaMinutes: null,
      serviceable: false, pharmacyName: ''
    });
  });

  useEffect(() => {
    const savedPin = deliveryLocation.pincode;
    if (!/^[1-9]\d{5}$/.test(String(savedPin || ''))) return;
    api.checkServiceability(savedPin).then((result) => {
      if (!result?.success || !result.serviceable) return;
      setDeliveryLocation((current) => current.pincode !== savedPin ? current : {
        ...current,
        area: result.area || current.area || `PIN ${savedPin}`,
        city: result.city || current.city || 'India',
        serviceable: true,
        expressEligible: Boolean(result.expressEligible),
        etaMinutes: result.etaMinutes || null,
        etaLabel: result.etaLabel || (result.etaMinutes ? `${result.etaMinutes} minutes` : '2–5 business days'),
        pharmacyName: result.pharmacyName || '10 MN Company nationwide delivery'
      });
    }).catch(() => {});
  }, []);

  // Cart State
  const [cart, setCart] = useState(() => user?.id ? safeJsonParse(`mim_cart_${user.id}`, []) : []);

  // Active Prescription State
  const [attachedPrescription, setAttachedPrescription] = useState(null);

  // Active Order for Tracking
  const [activeOrderId, setActiveOrderId] = useState(() => {
    try {
      const saved = localStorage.getItem('mim_active_order');
      return saved && saved !== 'undefined' ? saved : '';
    } catch {
      return '';
    }
  });

  // Modals & Panels State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const [deliveredOrder, setDeliveredOrder] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Socket instance
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(API_ORIGIN);
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Listen for Supabase Authentication State
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const sbUser = session.user;
        setUser({
          id: sbUser.id,
          name: sbUser.user_metadata?.full_name || sbUser.email.split('@')[0],
          email: sbUser.email,
          phone: sbUser.user_metadata?.phone || '',
          role: 'buyer',
          pharmacyName: sbUser.user_metadata?.pharmacy_name || '',
          licenseNumber: sbUser.user_metadata?.license_number || ''
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const sbUser = session.user;
        setUser({
          id: sbUser.id,
          name: sbUser.user_metadata?.full_name || sbUser.email.split('@')[0],
          email: sbUser.email,
          phone: sbUser.user_metadata?.phone || '',
          role: 'buyer',
          pharmacyName: sbUser.user_metadata?.pharmacy_name || '',
          licenseNumber: sbUser.user_metadata?.license_number || ''
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('mim_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mim_user');
    }
  }, [user]);

  useEffect(() => {
    const nextOwnerId = user?.id || null;
    if (cartLoadedForUserId !== nextOwnerId) {
      setCart(nextOwnerId ? safeJsonParse(`mim_cart_${nextOwnerId}`, []) : []);
      setCartLoadedForUserId(nextOwnerId);
      setAttachedPrescription(null);
      setIsCheckoutModalOpen(false);
    }
  }, [user?.id, cartLoadedForUserId]);

  useEffect(() => {
    localStorage.setItem('mim_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    localStorage.setItem('mim_location', JSON.stringify(deliveryLocation));
  }, [deliveryLocation]);

  useEffect(() => {
    localStorage.removeItem('mim_cart');
    if (user?.id && cartLoadedForUserId === user.id) {
      localStorage.setItem(`mim_cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user?.id, cartLoadedForUserId]);

  useEffect(() => {
    if (!user || pendingCartItems.length === 0) return;
    setCart((prev) => {
      return pendingCartItems.reduce((items, { medicine, quantity }) => {
        const existing = items.find((item) => item._id === medicine._id);
        if (existing) {
          return items.map((item) => item._id === medicine._id
            ? { ...item, quantity: item.quantity + quantity }
            : item);
        }
        return [...items, { ...medicine, quantity }];
      }, prev);
    });
    setPendingCartItems([]);
    setIsCartOpen(true);
    showToast('Your selected items were added to your cart.');
  }, [user?.id, pendingCartItems]);

  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem('mim_active_order', activeOrderId);
    }
  }, [activeOrderId]);

  // Cart Functions
  const addToCart = (medicine, qty = 1) => {
    const availableStock = Number(medicine?.stock ?? 1);
    if (!Number.isFinite(availableStock) || availableStock < 1) {
      showToast('This medicine is currently out of stock.', 'error');
      return false;
    }
    const existingQuantity = cart.find((item) => item._id === medicine._id)?.quantity || 0;
    if (existingQuantity + qty > availableStock) {
      showToast(`Only ${availableStock} item${availableStock === 1 ? '' : 's'} available in stock.`, 'info');
      return false;
    }
    if (!user) {
      setPendingCartItems((prev) => [...prev, { medicine, quantity: qty }]);
      setIsAuthModalOpen(true);
      showToast('Sign in or create an account to add items to your cart.', 'info');
      return false;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item._id === medicine._id);
      if (existing) {
        return prev.map((item) =>
          item._id === medicine._id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...medicine, quantity: qty }];
    });
    showToast(`Added ${medicine.name} to cart`);
    return true;
  };

  const removeFromCart = (medicineId) => {
    setCart((prev) => prev.filter((item) => item._id !== medicineId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQty = (medicineId, newQty) => {
    if (!user) return;
    const item = cart.find((cartItem) => cartItem._id === medicineId);
    if (item && newQty > Number(item.stock ?? newQty)) {
      showToast(`Only ${item.stock} item${Number(item.stock) === 1 ? '' : 's'} available in stock.`, 'info');
      return;
    }
    if (newQty <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item._id === medicineId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Address Functions
  const addAddress = (addr) => {
    const newAddr = {
      id: addr.id || 'addr_' + Date.now(),
      label: addr.label || 'Home',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      landmark: addr.landmark || '',
      fullAddress: addr.fullAddress || `${addr.street}, ${addr.landmark ? addr.landmark + ', ' : ''}${addr.city} - ${addr.pincode}`,
      lat: addr.lat || 28.6315,
      lng: addr.lng || 77.2167,
      isDefault: addr.isDefault || false
    };

    setSavedAddresses((prev) => {
      let updated = [...prev];
      if (newAddr.isDefault) {
        updated = updated.map((a) => ({ ...a, isDefault: false }));
      }
      return [...updated, newAddr];
    });

    showToast('New address saved to address book');
    return newAddr;
  };

  const deleteAddress = (addressId) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== addressId));
    showToast('Address removed', 'info');
  };

  // Change Delivery Location
  const updateDeliveryLocation = (locationObj) => {
    setDeliveryLocation(locationObj);
    showToast(`Delivery location set to ${locationObj.area || locationObj.pincode}`);
  };

  const trackOrder = (orderId) => {
    setActiveOrderId(orderId);
    setActiveTab('track');
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartMrpTotal = cart.reduce((sum, item) => sum + (item.mrp || item.price) * item.quantity, 0);
  const cartDiscount = +(cartMrpTotal - cartSubtotal).toFixed(2);
  const deliveryFee = deliveryLocation.serviceable && deliveryLocation.expressEligible ? 0 : 25;
  const packagingFee = 15;
  const cartTax = +(cartSubtotal * 0.05).toFixed(2);
  const cartTotal = +(cartSubtotal + deliveryFee + packagingFee + cartTax).toFixed(2);
  const hasPrescriptionItems = cart.some((item) => item.prescriptionRequired);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        setUser,
        savedAddresses,
        setSavedAddresses,
        addAddress,
        deleteAddress,
        deliveryLocation,
        updateDeliveryLocation,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartSubtotal,
        cartMrpTotal,
        cartDiscount,
        deliveryFee,
        packagingFee,
        cartTax,
        cartTotal,
        hasPrescriptionItems,
        attachedPrescription,
        setAttachedPrescription,
        activeOrderId,
        setActiveOrderId,
        trackOrder,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isPrescriptionModalOpen,
        setIsPrescriptionModalOpen,
        isCartOpen,
        setIsCartOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSuccessModalOpen,
        setIsSuccessModalOpen,
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        deliveredOrder,
        setDeliveredOrder,
        invoiceData,
        setInvoiceData,
        toast,
        showToast,
        socket,
        supabase,
        supabaseAuth
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
