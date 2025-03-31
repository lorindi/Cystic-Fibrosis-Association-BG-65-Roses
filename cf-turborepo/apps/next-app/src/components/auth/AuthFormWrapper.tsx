import React, { ReactNode } from 'react'

interface AuthFormWrapperProps {
  title: string
  children: ReactNode
}

export default function AuthFormWrapper({ title, children }: AuthFormWrapperProps) {
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold text-center text-teal-700 mb-8">
        {title}
      </h1>
      {children}
    </div>
  )
} 