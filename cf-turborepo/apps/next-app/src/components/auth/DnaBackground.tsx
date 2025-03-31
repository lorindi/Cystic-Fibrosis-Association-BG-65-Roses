import React from 'react'
import Image from 'next/image'

export default function DnaBackground() {
  return (
    <div className="h-full w-full relative">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-700 to-teal-900 opacity-50"></div>
      <div className="h-full w-full flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src="/gif/dna.gif"
            alt="DNA Animation"
            fill
            className="object-cover opacity-70"
          />
        </div>
      </div>
    </div>
  )
} 