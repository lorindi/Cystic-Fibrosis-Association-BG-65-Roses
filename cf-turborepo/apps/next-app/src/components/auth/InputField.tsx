'use client';

import React, { forwardRef } from 'react';
import { InputFieldProps } from './types';

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, className = '', error, id, ...props }, ref) => {
    return (
      <div className={`mb-4 ${className}`}>
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          suppressHydrationWarning
          className={`w-full px-3 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField; 