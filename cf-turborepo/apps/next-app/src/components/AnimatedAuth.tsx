import React, { ReactNode } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface AnimatedAuthProps {
  children: ReactNode
}

const AnimatedAuth: React.FC<AnimatedAuthProps> = ({ children }) => {
  const pathname = usePathname()
  const isSignIn = pathname === '/sign-in'
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <motion.div
        className="hidden md:block md:w-1/2 bg-teal-800"
        initial={{ x: isSignIn ? '100%' : '0%' }}
        animate={{ x: isSignIn ? '100%' : '0%' }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.7 
        }}
        style={{
          position: 'absolute',
          left: isSignIn ? '50%' : '0%',
          top: 0,
          height: '100%',
          zIndex: 10
        }}
      >
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
      </motion.div>
      
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-gray-50 p-8">
        {children}
      </div>
    </div>
  )
}

export default AnimatedAuth 