'use client';

import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useMutation } from '@apollo/client';
import { CREATE_PAYMENT_INTENT, CONFIRM_PAYMENT } from '@/app/campaigns/graphql/mutations';
import { toast } from 'sonner';

interface PaymentFormProps {
  amount: number;
  campaignId?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: Error) => void;
}

export default function PaymentForm({ 
  amount, 
  campaignId, 
  onSuccess, 
  onError 
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT);
  const [confirmPayment] = useMutation(CONFIRM_PAYMENT);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { data } = await createPaymentIntent({
        variables: {
          input: {
            amount: amount,
            currency: 'bgn',
            type: campaignId ? 'campaign_donation' : 'other_donation',
            campaignId: campaignId || null,
            description: campaignId ? `Donation to campaign` : 'General donation'
          }
        }
      });

      const clientSecret = data.createPaymentIntent.clientSecret;
      const paymentIntentId = data.createPaymentIntent.paymentIntentId;

      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
        throw new Error('Card elements not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: '',
          },
        }
      });

      if (error) {
        throw new Error(error.message || 'Payment failed');
      }

      if (paymentIntent.status === 'succeeded') {
        try {
          await confirmPayment({
            variables: {
              paymentIntentId
            }
          });
          console.log('Payment confirmed in database');
        } catch (confirmError) {
          console.error('Error confirming payment in database:', confirmError);
        }

        toast.success('Payment successful!');
        if (onSuccess) {
          onSuccess(paymentIntentId);
        }
      } else {
        toast.error(`Payment status: ${paymentIntent.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const stripeElementStyle = {
    base: {
      fontSize: '16px',
      color: '#374151',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      '::placeholder': {
        color: '#9CA3AF',
      },
      iconColor: '#6B7280',
    },
    invalid: {
      color: '#EF4444',
      iconColor: '#EF4444',
    },
    complete: {
      color: '#059669',
      iconColor: '#059669',
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Card Information</h4>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="card-number-element" className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <div className="relative">
              <div className="p-4 border border-gray-300 rounded-lg bg-white focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-colors">
                <CardNumberElement
                  id="card-number-element"
                  options={{
                    style: stripeElementStyle,
                    placeholder: '1234 1234 1234 1234',
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="card-expiry-element" className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <div className="p-4 border border-gray-300 rounded-lg bg-white focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-colors">
                <CardExpiryElement
                  id="card-expiry-element"
                  options={{
                    style: stripeElementStyle,
                  }}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="card-cvc-element" className="block text-sm font-medium text-gray-700 mb-2">
                CVC
              </label>
              <div className="p-4 border border-gray-300 rounded-lg bg-white focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-colors">
                <CardCvcElement
                  id="card-cvc-element"
                  options={{
                    style: stripeElementStyle,
                    placeholder: '123',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900">Secure Payment</p>
            <p className="text-sm text-gray-600">Your payment information is encrypted and secure. We use Stripe for processing.</p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2
          ${isProcessing 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Complete Donation - {amount.toFixed(2)} BGN</span>
          </>
        )}
      </button>
    </form>
  );
} 