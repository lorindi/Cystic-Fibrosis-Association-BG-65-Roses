import React from 'react'
import Logo from '../logo/Logo'
import Link from 'next/link'
import Button from '../buttons/Button'

function WebMenu() {
  return (
    <div className='flex items-center justify-between w-full px-10'>
        <Logo type='navigation'/>
        <div className='flex items-center justify-end gap-15 '>
          <ul className='flex items-center justify-end gap-4 w-full max-w-[754px]'>
            <li><Link href='/'>Home</Link></li>
            <li><Link href='/news'>News</Link></li>
            <li><Link href='/events'>Events</Link></li>
            <li><Link href='/causes'>History</Link></li>
            <li><Link href='/about'>Charities</Link></li>
            <li><Link href='/profile'>Profile</Link></li>
          </ul>
          <div className='flex items-center justify-end w-full max-w-[240px]'>
            <Button type='outlined' text='Make Donate'/>
          </div>
        </div>
    </div>
  )
}

export default WebMenu