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
    onAmountSelected(amount * 100); // Convert to cents for Stripe
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
      onAmountSelected(Math.round(numValue * 100)); // Convert to cents for Stripe, rounded
    } else {
      setSelectedAmount(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="font-medium text-lg">Select Donation Amount</div>
      
      <div className="grid grid-cols-3 gap-2">
        {predefinedAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handlePredefinedAmount(amount)}
            className={`py-2 px-4 border rounded-md text-sm font-medium ${
              selectedAmount === amount && !isCustom
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {amount} BGN
          </button>
        ))}
        
        <button
          type="button"
          onClick={() => setIsCustom(true)}
          className={`py-2 px-4 border rounded-md text-sm font-medium ${
            isCustom
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Custom
        </button>
      </div>
      
      {isCustom && (
        <div className="mt-3">
          <label htmlFor="custom-amount" className="sr-only">
            Custom amount
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">BGN</span>
            </div>
            <input
              type="text"
              name="custom-amount"
              id="custom-amount"
              autoFocus
              className="focus:ring-primary focus:border-primary block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              value={customAmount}
              onChange={handleCustomAmountChange}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Enter an amount greater than 1 BGN
          </p>
        </div>
      )}
    </div>
  );
} 