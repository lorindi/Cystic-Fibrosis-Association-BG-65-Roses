import React from 'react'

interface SubmitButtonProps {
  text: string
}

export default function SubmitButton({ text }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="flex-1 py-2 px-4 bg-teal-700 text-white rounded-md hover:bg-teal-800"
    >
      {text}
    </button>
  )
} 