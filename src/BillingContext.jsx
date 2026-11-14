import React, { createContext, useContext, useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { NativePurchases } from '@capgo/native-purchases';
import toast from 'react-hot-toast';

export const LOCKED_TOOL_CODES = [
  { id: 'oc', name: 'OC Master', category: 'Framing' },
  { id: 'st', name: 'Stair Master Pro', category: 'Framing' },
  { id: 'rk', name: 'Rake Walls', category: 'Framing' },
  { id: 'ds', name: 'Span Master', category: 'Framing' },
  { id: 'rr', name: 'Roof Rafters', category: 'Framing' },
  { id: 'co', name: 'Concrete & Sonotube', category: 'Concrete & Site Work' },
  { id: 'bc', name: 'Masonry Master', category: 'Concrete & Site Work' },
  { id: 'fi', name: 'Volume & Fill', category: 'Concrete & Site Work' },
  { id: 'pl', name: 'Payload Tracker', category: 'Concrete & Site Work' },
  { id: 'wc', name: 'Wall Calculator', category: 'Material Estimators' },
  { id: 'rm', name: 'Roofing Master', category: 'Material Estimators' },
  { id: 'si', name: 'Siding & Gable', category: 'Material Estimators' },
  { id: 'df', name: 'Decking', category: 'Material Estimators' },
  { id: 'tl', name: 'Tile & Flooring', category: 'Material Estimators' },
];

const BillingContext = createContext();

export const BillingProvider = ({ children }) => {
  const [isPro, setIsPro] = useState(() => {
    if (typeof window !== 'undefined' && !Capacitor.isNativePlatform()) {
      return localStorage.getItem('squared_pro_unlocked') === 'true';
    }
    return false;
  });
  const [isReady, setIsReady] = useState(false);
  const [proPrice, setProPrice] = useState('...');
  const PRODUCT_ID = 'squared_pro_unlock';

  const checkIfOwned = (data) => {
    if (!data) return false;
    return JSON.stringify(data).includes(PRODUCT_ID);
  };

  useEffect(() => {
    const setupBilling = async () => {
      if (!Capacitor.isNativePlatform()) {
        setProPrice('$9.99');
        setIsReady(true);
        return;
      }

      try {
        await NativePurchases.initialize();
        const products = await NativePurchases.getProducts({ productIdentifiers: [PRODUCT_ID] });
        if (products && products.length > 0) setProPrice(products[0].price);

        const response = await NativePurchases.restorePurchases();
        if (checkIfOwned(response)) setIsPro(true);
      } catch (error) {
        console.error("Billing init failed:", error);
      } finally {
        setIsReady(true);
      }
    };
    setupBilling();
  }, []);

  const purchasePro = async () => {
    if (!Capacitor.isNativePlatform()) {
      setIsPro(true);
      localStorage.setItem('squared_pro_unlocked', 'true');
      toast.success('Pro Access Unlocked!');
      return;
    }

    try {
      const purchase = await NativePurchases.purchaseProduct({ productIdentifier: PRODUCT_ID });
      
      setIsPro(true);
      
      try {
        await NativePurchases.finishTransaction({ transactionId: purchase.transactionId });
      } catch (e) {}
      
    } catch (error) {
      const errorStr = String(error?.message || JSON.stringify(error) || "").toLowerCase();
      
      // ONLY force unlock if Google explicitly states they already own it (Error 7 Glitch)
      if (
        errorStr.includes('already') || 
        errorStr.includes('owned') || 
        errorStr.includes('7')
      ) {
         setIsPro(true);
         return;
      }

      // If they cancelled or it failed, just try restoring gracefully without giving it away
      restorePurchases(false); 
    }
  };

  const restorePurchases = async (showSuccessAlert = true) => {
    if (!Capacitor.isNativePlatform()) {
      const owned = localStorage.getItem('squared_pro_unlocked') === 'true';
      if (owned) {
        setIsPro(true);
        if (showSuccessAlert) toast.success("Purchases restored! You have Pro access.");
      } else {
        if (showSuccessAlert) toast.error("No previous Pro purchase found on this account.");
      }
      return;
    }

    try {
      const response = await NativePurchases.restorePurchases();
      if (checkIfOwned(response)) {
        setIsPro(true);
        if (showSuccessAlert) toast.success("Purchases restored! You have Pro access.");
      } else {
        if (showSuccessAlert) toast.error("No previous Pro purchase found on this account.");
      }
    } catch (error) {
      console.error("Restore failed:", error);
    }
  };

  return (
    <BillingContext.Provider value={{ isPro, isReady, proPrice, purchasePro, restorePurchases, setIsPro }}>
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => useContext(BillingContext);