'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import { supabaseAuth } from '@/lib/supabase';

const AppContext = createContext(null);

const safeJsonParse = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
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
  const [user, setUser] = useState(null);

  const [pendingCartItems, setPendingCartItems] = useState([]);
  const [cartLoadedForUserId, setCartLoadedForUserId] = useState(null);

  // Saved Delivery Addresses (Home, Work, Other)
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Current Selected Delivery Location
  const [deliveryLocation, setDeliveryLocation] = useState({
    pincode: '', area: '', city: '', street: '', landmark: '', fullAddress: '',
    label: '', lat: null, lng: null, expressEligible: false, etaMinutes: null,
    serviceable: false, pharmacyName: ''
  });

  const isHydratedRef = useRef(false);

  // Cart State
  const [cart, setCart] = useState([]);

  // Active Prescription State
  const [attachedPrescription, setAttachedPrescription] = useState(null);

  // Active Order for Tracking
  const [activeOrderId, setActiveOrderId] = useState('');

  // Initial client hydration from localStorage to prevent SSR mismatch
  useEffect(() => {
    try {
      const savedUser = safeJsonParse('mim_user', null);
      if (savedUser && ['buyer', 'admin'].includes(savedUser.role)) {
        const legacyAdminToken = savedUser?.role === 'admin' ? localStorage.getItem('mim_token') : null;
        if (legacyAdminToken && !localStorage.getItem('mim_admin_token')) {
          localStorage.setItem('mim_admin_token', legacyAdminToken);
        }
        const hasLocalAdminToken = Boolean(localStorage.getItem('mim_admin_token') || legacyAdminToken);
        setUser({ ...savedUser, role: savedUser.role === 'admin' && hasLocalAdminToken ? 'admin' : 'buyer' });
        const userCart = safeJsonParse(`mim_cart_${savedUser.id}`, []);
        setCart(userCart);
        setCartLoadedForUserId(savedUser.id);
      }

      const savedAddr = safeJsonParse('mim_addresses', null);
      if (savedAddr && Array.isArray(savedAddr) && savedAddr.length > 0) {
        setSavedAddresses(savedAddr);
      }

      const savedLoc = safeJsonParse('mim_location', null);
      if (savedLoc && savedLoc.pincode) {
        setDeliveryLocation(savedLoc);
      }

      const savedOrder = localStorage.getItem('mim_active_order');
      if (savedOrder && savedOrder !== 'undefined') {
        setActiveOrderId(savedOrder);
      }
    } catch (err) {
      console.warn('Client hydration error:', err);
    } finally {
      isHydratedRef.current = true;
    }
  }, []);

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
  }, [deliveryLocation.pincode]);

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
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  // Listen for Supabase Authentication State
  useEffect(() => {
    let mounted = true;
    let subscription = null;
    supabaseAuth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (typeof window !== 'undefined' && localStorage.getItem('mim_admin_token')) return;
      if (session?.user) {
        const sbUser = session.user;
        setUser({
          id: sbUser.id,
          name: sbUser.user_metadata?.full_name || sbUser.email.split('@')[0],
          email: sbUser.email,
          phone: sbUser.user_metadata?.phone || '',
          role: 'buyer'
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    }).then((authSubscription) => {
      if (mounted) subscription = authSubscription;
      else authSubscription?.unsubscribe?.();
    }).catch((error) => console.warn('Could not restore customer authentication session:', error));

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  // Save changes to localStorage only after client hydration
  useEffect(() => {
    if (!isHydratedRef.current || typeof window === 'undefined') return;
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
    if (!isHydratedRef.current || typeof window === 'undefined') return;
    localStorage.setItem('mim_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    if (!isHydratedRef.current || typeof window === 'undefined') return;
    localStorage.setItem('mim_location', JSON.stringify(deliveryLocation));
  }, [deliveryLocation]);

  useEffect(() => {
    if (!isHydratedRef.current || typeof window === 'undefined') return;
    if (activeOrderId) {
      localStorage.setItem('mim_active_order', activeOrderId);
    } else {
      localStorage.removeItem('mim_active_order');
    }
  }, [activeOrderId]);

  useEffect(() => {
    if (!isHydratedRef.current || typeof window === 'undefined') return;
    localStorage.removeItem('mim_cart');
    const userId = user?.id;
    if (userId && cartLoadedForUserId === userId) {
      localStorage.setItem(`mim_cart_${userId}`, JSON.stringify(cart));
    }
  }, [cart, user?.id, cartLoadedForUserId]);

  useEffect(() => {
    if (!user?.id || pendingCartItems.length === 0) return;
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
  }, [user?.id, pendingCartItems, showToast]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (activeOrderId) {
      localStorage.setItem('mim_active_order', activeOrderId);
    }
  }, [activeOrderId]);

  // Cart Functions
  const addToCart = (medicine, qty = 1) => {
    const quantity = Number(qty);
    if (!Number.isInteger(quantity) || quantity < 1) {
      showToast('Choose a valid quantity.', 'error');
      return false;
    }
    const availableStock = Number(medicine?.stock ?? 1);
    if (!Number.isFinite(availableStock) || availableStock < 1) {
      showToast('This medicine is currently out of stock.', 'error');
      return false;
    }
    const existingQuantity = (cart.find((item) => item._id === medicine._id)?.quantity || 0)
      + pendingCartItems.filter((item) => item.medicine._id === medicine._id).reduce((sum, item) => sum + item.quantity, 0);
    if (existingQuantity + quantity > availableStock) {
      showToast(`Only ${availableStock} item${availableStock === 1 ? '' : 's'} available in stock.`, 'info');
      return false;
    }
    if (!user) {
      setPendingCartItems((prev) => [...prev, { medicine, quantity }]);
      setIsAuthModalOpen(true);
      showToast('Sign in or create an account to add items to your cart.', 'info');
      return false;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item._id === medicine._id);
      if (existing) {
        return prev.map((item) =>
          item._id === medicine._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...medicine, quantity }];
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
    const quantity = Number(newQty);
    const item = cart.find((cartItem) => cartItem._id === medicineId);
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    if (!Number.isInteger(quantity)) {
      showToast('Choose a whole-number quantity.', 'error');
      return;
    }
    if (item && quantity > Number(item.stock ?? quantity)) {
      showToast(`Only ${item.stock} item${Number(item.stock) === 1 ? '' : 's'} available in stock.`, 'info');
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item._id === medicineId ? { ...item, quantity } : item))
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
        socket: null,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
