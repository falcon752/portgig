'use client'

import Buttons from '@/src/components/Buttons'
import Image from 'next/image'
import Link from 'next/link'

export default function RecruiterEmailConfirmed() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-[url('/assets/auth-woman-2.png')] bg-no-repeat bg-cover bg-center p-4 sm:p-8 md:p-10">
      {/* Logo */}
      <div className='self-start '>
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
      <div className='bg-white w-full lg:w-10/12 pb-10 rounded-lg shadow-lg flex flex-col items-center justify-center text-primary md:my-auto mt-16 sm:mt-20 md:mt-0 min-h-[60vh] md:min-h-0'>
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
          </p>{' '}
          <Link href='/recruiter-onboarding'>
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