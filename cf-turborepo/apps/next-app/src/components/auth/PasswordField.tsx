"use client"
import React, { useState } from 'react'

interface PasswordFieldProps {
  id: string
  label: string
  placeholder?: string
  required?: boolean
  className?: string
  mb?: string
}

export default function PasswordField({ 
  id, 
  label, 
  placeholder = '', 
  required = false,
  className = '',
  mb = 'mb-4'
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  
  return (
    <div className={`${mb} ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          placeholder={placeholder}
          required={required}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>
    </div>
  )
} 