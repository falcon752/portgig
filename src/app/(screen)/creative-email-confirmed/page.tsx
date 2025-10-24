'use client'

import { Buttons } from '@/src/components/export_components'
import Image from 'next/image'
import Link from 'next/link'

export default function CreativeEmailConfirmed() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-[url('/assets/auth-man-2.png')] bg-no-repeat bg-cover bg-center p-4 sm:p-8 md:p-10 font-raleway">
      {/* Logo */}
      <div className='self-start mb-6'>
        <Link href='/'>
          <Image
            src='/assets/white-logo.png'
            alt='Portgig Logo'
            width={120}
            height={120}
            className='w-[100px] sm:w-[120px] h-auto'
          />
        </Link>
      </div>

      {/* Content Box */}
      <div className='  bg-white w-full lg:w-10/12 p-5 sm:p-8 rounded-lg shadow-lg flex flex-col  items-center justify-center text-primary my-auto'>
        <Image
          src='/assets/checkmark.svg'
          alt='Email Confirmation'
          width={100}
          height={40}
          className='h-40 w-40 md:h-96 md:w-96 lg:h-150 lg:w-150'
        />

        <div className='flex flex-col gap-5'>
          {' '}
          <h2 className='font-bold text-xl sm:text-3xl lg:text-5xl text-center font-ramaraja'>
            Email Confirmed
          </h2>
          <p className='text-[12px] sm:text-xl text-center font-raleway font-bold'>
            Thank you
          </p>
          <Link href='/welcome-onboarding?type=creator'>
            <Buttons
              className='bg-primary! text-white rounded-none px-10 md:px-20 py-3 text-lg sm:text-2xl lg:text-3xl font-inter'
              label='Get started'
            />
          </Link>
        </div>
      </div>
    </main>
  )
}
