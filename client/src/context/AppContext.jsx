import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { api } from '../api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState('home');

  // User State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mim_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr_guest_demo',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210'
    };
  });

  // Saved Delivery Addresses (Home, Work, Other)
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const saved = localStorage.getItem('mim_addresses');
    return saved ? JSON.parse(saved) : [
      {
        id: 'addr_1',
        label: 'Home',
        street: 'Flat 402, Green Avenue, Barakhamba Road',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        landmark: 'Near Central Park Gate 2',
        fullAddress: 'Flat 402, Green Avenue, Barakhamba Road, Connaught Place, New Delhi - 110001',
        lat: 28.6315,
        lng: 77.2167,
        isDefault: true
      },
      {
        id: 'addr_2',
        label: 'Work',
        street: 'Tech Park Tower 3, DLF Cyber City',
        city: 'Gurgaon',
        state: 'Haryana',
        pincode: '122002',
        landmark: 'Opposite Cyber Hub',
        fullAddress: 'Tech Park Tower 3, DLF Cyber City, Sector 24, Gurgaon - 122002',
        lat: 28.4900,
        lng: 77.0900,
        isDefault: false
      }
    ];
  });

  // Current Selected Delivery Location
  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    const saved = localStorage.getItem('mim_location');
    return saved ? JSON.parse(saved) : {
      pincode: '110001',
      area: 'Connaught Place',
      city: 'New Delhi',
      street: 'Flat 402, Green Avenue',
      landmark: 'Near Central Park Gate 2',
      fullAddress: 'Connaught Place, New Delhi - 110001',
      label: 'Home',
      lat: 28.6315,
      lng: 77.2167,
      expressEligible: true,
      etaMinutes: 10,
      serviceable: true,
      pharmacyName: 'Apollo Pharmacy Express'
    };
  });

  // Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('mim_cart');
    return saved ? JSON.parse(saved) : [
      {
        _id: 'med_1',
        name: 'Dolo 650 Tablet',
        brand: 'Micro Labs',
        genericName: 'Paracetamol (650mg)',
        price: 30.50,
        mrp: 34.00,
        quantity: 2,
        packSize: 'Strip of 15 tablets',
        prescriptionRequired: false,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80'
      }
    ];
  });

  // Active Prescription State
  const [attachedPrescription, setAttachedPrescription] = useState(null);

  // Active Order for Tracking
  const [activeOrderId, setActiveOrderId] = useState(() => {
    return localStorage.getItem('mim_active_order') || '';
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
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('mim_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mim_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    localStorage.setItem('mim_location', JSON.stringify(deliveryLocation));
  }, [deliveryLocation]);

  useEffect(() => {
    localStorage.setItem('mim_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem('mim_active_order', activeOrderId);
    }
  }, [activeOrderId]);

  // Cart Functions
  const addToCart = (medicine, qty = 1) => {
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
  };

  const removeFromCart = (medicineId) => {
    setCart((prev) => prev.filter((item) => item._id !== medicineId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQty = (medicineId, newQty) => {
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
  const cartTotal = +(cartSubtotal + deliveryFee + packagingFee).toFixed(2);
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
        socket
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
