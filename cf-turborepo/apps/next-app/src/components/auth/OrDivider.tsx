import React from 'react'

export default function OrDivider() {
  return (
    <div className="relative flex items-center justify-center my-6">
      <div className="border-t border-gray-300 w-full"></div>
      <div className="absolute bg-white px-3 text-xs text-gray-500">or</div>
    </div>
  )
} 