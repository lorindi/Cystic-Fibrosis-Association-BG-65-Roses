'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StripeProvider from './StripeProvider';
import DonationAmount from './DonationAmount';
import PaymentForm from './PaymentForm';
import { toast } from 'sonner';
import { useMutation } from '@apollo/client';
import { ADD_CAMPAIGN_COMMENT } from '@/graphql/queries/campaign';
import { Rating } from '@/components/ui/Rating';

interface DonationWidgetProps {
  campaignId?: string;
  campaignTitle?: string;
  campaignGoal?: number;
  campaignCurrentAmount?: number;
  onSuccess?: (paymentIntentId: string) => void;
}

export function DonationWidget({ 
  campaignId, 
  campaignTitle,
  campaignGoal,
  campaignCurrentAmount,
  onSuccess 
}: DonationWidgetProps) {
  const router = useRouter();
  const [amount, setAmount] = useState<number | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');

  const [addCampaignComment, { loading: commentLoading }] = useMutation(ADD_CAMPAIGN_COMMENT);

  const handleAmountSelected = (selectedAmount: number) => {
    setAmount(selectedAmount);
  };

  const handleContinue = () => {
    if (!amount || amount < 1) {
      toast.error('Please select a valid donation amount');
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentSuccess(true);
    setIsProcessing(false);
    setShowRatingForm(true);
    if (onSuccess) {
      onSuccess(paymentIntentId);
    }
  };

  const handlePaymentError = (error: Error) => {
    setIsProcessing(false);
    toast.error(`Payment failed: ${error.message}`);
  };

  const handleSubmitRating = async () => {
    if (!campaignId) return;
    
    try {
      await addCampaignComment({
        variables: {
          campaignId,
          rating,
          comment
        }
      });
      
      toast.success('Благодарим за вашата оценка и коментар!');
      
      setTimeout(() => {
        router.push(`/campaigns/${campaignId}`);
      }, 1500);
      
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Грешка при изпращане на оценка: ${error.message}`);
      }
    }
  };

  const handleSkipRating = () => {
    if (campaignId) {
      router.push(`/campaigns/${campaignId}`);
    } else {
      setShowRatingForm(false);
    }
  };

  // Success states (final success only)
  if (paymentSuccess && !showRatingForm) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center space-y-4">
          <div className="text-green-600 text-xl font-semibold">Thank you for your donation!</div>
          <p className="text-gray-600">Your support means a lot to us.</p>
          <button
            type="button"
            onClick={() => {
              setPaymentSuccess(false);
              setShowPaymentForm(false);
              setAmount(null);
              setRating(null);
              setComment('');
            }}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1536px] mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          
          {/* Left Side - Donation Summary */}
          <div className="bg-gradient-to-br from-teal-500 via-blue-500 to-blue-600 p-8 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full"></div>
              <div className="absolute top-1/3 -left-8 w-16 h-16 bg-white rounded-full"></div>
              <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-white rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              {showPaymentForm && (
                <div className="mb-8">
                  <button 
                    onClick={() => setShowPaymentForm(false)}
                    className="inline-flex items-center text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to amount selection
                  </button>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold leading-tight">
                    {campaignTitle ? `Donate to ${campaignTitle}` : 'Make a Donation'}
                  </h2>
                  <p className="text-white/80 mt-2">
                    Your contribution makes a difference in the lives of people with cystic fibrosis.
                  </p>
                </div>

                {/* Campaign Progress Information */}
                {campaignGoal && campaignCurrentAmount !== undefined && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/80">Goal</span>
                        <span className="font-medium">{campaignGoal.toLocaleString()} BGN</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/80">Raised so far</span>
                        <span className="font-medium">
                          {amount 
                            ? `${(campaignCurrentAmount + amount).toLocaleString()} BGN`
                            : `${campaignCurrentAmount.toLocaleString()} BGN`
                          }
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="w-full bg-white/20 rounded-full h-3">
                          <div 
                            className="bg-white h-3 rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${Math.min(100, ((campaignCurrentAmount + (amount || 0)) / campaignGoal) * 100)}%` 
                            }} 
                          />
                        </div>
                        <div className="text-center">
                          <span className="text-lg font-bold">
                            {Math.round(((campaignCurrentAmount + (amount || 0)) / campaignGoal) * 100)}% Complete
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Subtotal</span>
                    <span className="font-medium">{amount?.toFixed(2) || '0.00'} BGN</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t border-white/20">
                    <span>Total</span>
                    <span>{amount?.toFixed(2) || '0.00'} BGN</span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-white/90">
                    <span className="font-medium">Secure Payment:</span> Your donation is processed securely through Stripe. 
                    We never store your payment information.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Form */}
          <div className="p-8">
            {!showPaymentForm ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Select Amount</h3>
                  <p className="text-gray-600">Choose your donation amount to continue.</p>
                </div>
                
                <DonationAmount onAmountSelected={handleAmountSelected} />
                
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={!amount || amount < 1}
                  className={`w-full py-3 px-6 rounded-lg text-lg font-medium transition-all duration-200
                    ${(!amount || amount < 1) 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                >
                  Continue to Payment
                </button>
              </div>
            ) : paymentSuccess && showRatingForm ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Rate the Campaign</h3>
                  <p className="text-gray-600">Бихте ли отделили момент да оцените кампанията?</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Rating value={rating} onChange={setRating} />
                  </div>
                  
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                      Какво ви мотивира да подкрепите тази кампания? Вашият коментар ще вдъхнови и други хора.
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                      placeholder="Споделете какво ви вдъхнови да помогнете..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={handleSkipRating}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Пропусни
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitRating}
                      disabled={commentLoading}
                      className="flex-1 py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 transition-colors"
                    >
                      {commentLoading ? 'Изпращане...' : 'Изпрати оценка'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Payment Information</h3>
                  <p className="text-gray-600">Complete your donation securely.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Donation Amount:</span>
                    <span className="font-bold text-xl text-gray-900">{amount?.toFixed(2)} BGN</span>
                  </div>
                </div>
                
                <StripeProvider>
                  <PaymentForm 
                    amount={amount || 0}
                    campaignId={campaignId}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </StripeProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 