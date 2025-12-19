import { createContext, useContext, useMemo, useState } from 'react';

const CheckoutContext = createContext(null);

const defaultState = {
  service: null,
  selectedPackage: null,
  scheduledDate: '',
  duration: null,
  notes: '',
};

export const CheckoutProvider = ({ children }) => {
  const [checkoutData, setCheckoutData] = useState(defaultState);

  const value = useMemo(() => {
    const setServiceForCheckout = (service, selectedPackage, options = {}) => {
      setCheckoutData({
        service,
        selectedPackage,
        scheduledDate: options.scheduledDate || '',
        duration: options.duration ?? selectedPackage?.duration ?? null,
        notes: options.notes || '',
      });
    };

    const clearCheckout = () => {
      setCheckoutData(defaultState);
    };

    return {
      checkoutData,
      setServiceForCheckout,
      clearCheckout,
      setCheckoutData,
    };
  }, [checkoutData]);

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};

