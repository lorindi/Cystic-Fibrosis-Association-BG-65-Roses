import React from 'react'

interface InputFieldProps {
  id: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  className?: string
}

export default function InputField({ 
  id, 
  label, 
  type = 'text', 
  placeholder = '', 
  required = false,
  className = ''
}: InputFieldProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        required={required}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
      />
    </div>
  )
} 