'use client';

import React, { useState } from 'react';

interface DonationAmountProps {
  onAmountSelected: (amount: number) => void;
}

export default function DonationAmount({ onAmountSelected }: DonationAmountProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);

  // Predefined donation amounts in BGN
  const predefinedAmounts = [10, 20, 50, 100, 200];

  const handlePredefinedAmount = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount('');
    onAmountSelected(amount);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only numbers and decimal point
    if (!/^\d*\.?\d{0,2}$/.test(value) && value !== '') {
      return;
    }
    
    setCustomAmount(value);
    setIsCustom(true);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(numValue);
      onAmountSelected(numValue);
    } else {
      setSelectedAmount(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Predefined amounts grid */}
      <div className="grid grid-cols-2 gap-3">
        {predefinedAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handlePredefinedAmount(amount)}
            className={`relative py-4 px-4 border-2 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 ${
              selectedAmount === amount && !isCustom
                ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-lg'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="text-center">
              <div className="text-xl font-bold">{amount}</div>
              <div className="text-sm text-gray-500">BGN</div>
            </div>
            {selectedAmount === amount && !isCustom && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
        
        <button
          type="button"
          onClick={() => setIsCustom(true)}
          className={`col-span-2 py-4 px-4 border-2 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 ${
            isCustom
              ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-lg'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Custom Amount</span>
          </div>
          {isCustom && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      </div>
      
      {/* Custom amount input */}
      {isCustom && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
          <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700">
            Enter your donation amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 text-lg font-medium">BGN</span>
            </div>
            <input
              type="text"
              name="custom-amount"
              id="custom-amount"
              autoFocus
              className="block w-full pl-16 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder-gray-400"
              placeholder="0.00"
              value={customAmount}
              onChange={handleCustomAmountChange}
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Minimum donation amount is 1 BGN</span>
          </div>
        </div>
      )}

      {/* Selected amount display */}
      {selectedAmount && (
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4 animate-in fade-in-50 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Selected Amount:</p>
              <p className="text-2xl font-bold text-teal-600">{selectedAmount.toFixed(2)} BGN</p>
            </div>
            <div className="flex items-center space-x-2 text-teal-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 