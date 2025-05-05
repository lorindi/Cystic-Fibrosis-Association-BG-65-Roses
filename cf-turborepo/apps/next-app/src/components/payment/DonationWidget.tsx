'use client';

import React, { useState } from 'react';
import StripeProvider from './StripeProvider';
import DonationAmount from './DonationAmount';
import PaymentForm from './PaymentForm';
import { toast } from 'sonner';

interface DonationWidgetProps {
  campaignId?: string;
  campaignTitle?: string;
  onSuccess?: (paymentIntentId: string) => void;
}

export function DonationWidget({ 
  campaignId, 
  campaignTitle, 
  onSuccess 
}: DonationWidgetProps) {
  const [amount, setAmount] = useState<number | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleAmountSelected = (selectedAmount: number) => {
    setAmount(selectedAmount);
  };

  const handleContinue = () => {
    if (!amount || amount < 100) { // Minimum amount is 1 BGN (100 cents)
      toast.error('Please select a valid donation amount');
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentSuccess(true);
    setIsProcessing(false);
    if (onSuccess) {
      onSuccess(paymentIntentId);
    }
  };

  const handlePaymentError = (error: Error) => {
    setIsProcessing(false);
    toast.error(`Payment failed: ${error.message}`);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {campaignTitle ? `Donate to ${campaignTitle}` : 'Make a Donation'}
      </h2>

      {paymentSuccess ? (
        <div className="text-center space-y-4">
          <div className="text-green-600 text-xl font-semibold">Thank you for your donation!</div>
          <p className="text-gray-600">Your support means a lot to us.</p>
          <button
            type="button"
            onClick={() => {
              setPaymentSuccess(false);
              setShowPaymentForm(false);
              setAmount(null);
            }}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Make Another Donation
          </button>
        </div>
      ) : showPaymentForm ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Donation Amount:</span>
            <span className="font-semibold text-gray-900">{amount ? (amount / 100).toFixed(2) : '0.00'} BGN</span>
          </div>
          
          <div className="pt-2">
            <StripeProvider>
              <PaymentForm 
                amount={amount || 0}
                campaignId={campaignId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </StripeProvider>
          </div>
          
          <button
            type="button"
            onClick={() => setShowPaymentForm(false)}
            className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Change Amount
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <DonationAmount onAmountSelected={handleAmountSelected} />
          
          <button
            type="button"
            onClick={handleContinue}
            disabled={!amount || amount < 100}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light
              ${(!amount || amount < 100) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Continue to Payment
          </button>
        </div>
      )}
    </div>
  );
} 