import React from 'react'
import Link from 'next/link'

interface BackButtonProps {
  href: string
  text?: string
}

export default function BackButton({ href, text = 'Back' }: BackButtonProps) {
  return (
    <Link 
      href={href}
      className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-center"
    >
      {text}
    </Link>
  )
} 