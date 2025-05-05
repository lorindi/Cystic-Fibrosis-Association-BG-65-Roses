'use client';

import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useMutation } from '@apollo/client';
import { CREATE_PAYMENT_INTENT } from '@/graphql/queries/payment';
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Create payment intent on the server
      const { data } = await createPaymentIntent({
        variables: {
          input: {
            amount: amount / 100, // Convert cents to actual amount in BGN
            currency: 'bgn', // Default to Bulgarian Lev
            type: campaignId ? 'campaign_donation' : 'other_donation',
            campaignId: campaignId || null,
            description: campaignId ? `Donation to campaign` : 'General donation'
          }
        }
      });

      const clientSecret = data.createPaymentIntent.clientSecret;
      const paymentIntentId = data.createPaymentIntent.paymentIntentId;

      // Get card elements
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
        throw new Error('Card elements not found');
      }

      // Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            // Add empty billing details to avoid form validation errors
            name: '',
          },
        }
      });

      if (error) {
        throw new Error(error.message || 'Payment failed');
      }

      if (paymentIntent.status === 'succeeded') {
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

  // Common styles for Stripe elements
  const stripeElementStyle = {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label htmlFor="card-number-element" className="block text-sm font-medium text-gray-700">
          Credit or Debit Card
        </label>
        
        <div className="p-3 border border-gray-300 rounded-md bg-white mb-2">
          <CardNumberElement
            id="card-number-element"
            options={{
              style: stripeElementStyle,
              placeholder: 'Card number',
            }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border border-gray-300 rounded-md bg-white">
            <CardExpiryElement
              id="card-expiry-element"
              options={{
                style: stripeElementStyle,
              }}
            />
          </div>
          
          <div className="p-3 border border-gray-300 rounded-md bg-white">
            <CardCvcElement
              id="card-cvc-element"
              options={{
                style: stripeElementStyle,
                placeholder: 'CVC',
              }}
            />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light
          ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? 'Processing...' : `Pay ${amount / 100} BGN`}
      </button>
    </form>
  );
} 