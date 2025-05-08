'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Create a loading component
const LoadingStripe = () => (
  <div className="w-full h-40 flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
);

// Get the publishable key from environment
const getPublishableKey = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error('Stripe publishable key is missing');
  }
  return key;
};

interface StripeProviderProps {
  children: ReactNode;
}

export default function StripeProvider({ children }: StripeProviderProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const key = getPublishableKey();
      setStripePromise(loadStripe(key));
    } catch (error) {
      console.error('Failed to load Stripe:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <LoadingStripe />;
  }

  if (!stripePromise) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Failed to load payment system. Please try again later.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
} 