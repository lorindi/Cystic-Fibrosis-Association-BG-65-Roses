
import React from 'react'
import WebMenu from './WebMenu'
import MobileMenu from './MobileMenu'

function Navbar() {
  return (
    <div className='w-full p-4'>
      <div className='hidden lg:flex w-full'>
        <WebMenu/>
      </div>

      <div className='lg:hidden w-full'>
        <MobileMenu/>
      </div>
    
    </div>
  )
}

export default Navbar