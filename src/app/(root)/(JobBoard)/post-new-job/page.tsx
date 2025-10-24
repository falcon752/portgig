'use client'

import Image from 'next/image'

import { Buttons } from '@/src/components/export_components'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// import { postNewJob } from "@/src/utils/authActions";
import { useState } from 'react'

const formSchema = z.object({
  jobTile: z.string().min(2, 'Job title is required'),
  whatYouLookingFor: z.string().min(30, 'Must be at least 10 characters'),
  salaryRange: z.string().min(2, 'Please input expected salary range'),
  jobDeadline: z.string().min(2, 'Please input Job deadline'),
  location: z.string().min(2, 'Please input Job Location'),
  workMode: z.string().min(2, 'Please input  Work Mode'),
  techincalSkills: z
    .string()
    .min(30, 'Please input technical skills you are looking for'),
})

type FormData = z.infer<typeof formSchema>
const PostJob = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })
  const [isLoading, setIsLoading] = useState(false)

  //API FUNCTION TO CREATE JOB
  const onSubmit = async (data: FormData) => {
    console.log('Form submitted:', data)
    try {
      setIsLoading(true)
      // await postNewJob(data)
      setIsLoading(false)
      reset()
    } catch (error: unknown) {
      setIsLoading(false)
      throw new Error((error as Error).message || 'Failed to update profile')
    }
  }

  const inputDiv = 'flex flex-col gap-2'
  const lableStyles = 'block text-sm lg:text-xl font-medium'
  const inputStyles =
    'w-full bg-gray100 p-3 rounded  focus:border focus:outline-none focus:border-secondary transition-colors duration-200'

  return (
    <main className='flex flex-col py-10 font-raleway'>
      <div className='flex justify-between items-end max-sm:h-20 h-30  border-b-2 border-primary pb-2'>
        <div className='flex flex-col justify-between h-full'>
          <h2 className='text-sm  md:text-lg lg:text-xl  font-black text-primary'>
            Dashboard
          </h2>
          <h2 className='smallHeading text-primary'>Post Job</h2>
        </div>
        <div className='px-5 py-2 bg-primary text-white rounded-sm text-xs'>
          Full Time Role
        </div>
        <Image
          src={'/assets/creativeImage.svg'}
          alt='recruiter profile'
          width={150}
          height={150}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='mt-20 space-y-5'>
        <div className={inputDiv}>
          <label htmlFor='jobTitle' className={lableStyles}>
            Job Title
          </label>
          <input
            id='fullName'
            {...register('jobTile')}
            className={inputStyles}
          />
          {errors.jobTile && (
            <p className='text-red500 text-sm'>{errors.jobTile.message}</p>
          )}
        </div>
        <div className={inputDiv}>
          <label htmlFor='whatYouLookingFor' className={lableStyles}>
            What You Looking For?
          </label>
          <input
            id='whatYouLookingFor'
            {...register('whatYouLookingFor')}
            className={inputStyles}
          />
          {errors.whatYouLookingFor && (
            <p className='text-red500 text-sm'>
              {errors.whatYouLookingFor.message}
            </p>
          )}
        </div>
        <div className={inputDiv}>
          <label htmlFor='salaryRange' className={lableStyles}>
            Salary Range
          </label>
          <input
            id='salaryRange'
            {...register('salaryRange')}
            className={inputStyles}
          />
          {errors.salaryRange && (
            <p className='text-red500 text-sm'>{errors.salaryRange.message}</p>
          )}
        </div>
        <div className={inputDiv}>
          <label htmlFor='jobDeadline' className={lableStyles}>
            Job Dealine
          </label>
          <input
            id='jobDeadline'
            {...register('jobDeadline')}
            className={inputStyles}
          />
          {errors.jobDeadline && (
            <p className='text-red500 text-sm'>{errors.jobDeadline.message}</p>
          )}
        </div>
        <div className={inputDiv}>
          <label htmlFor='location' className={lableStyles}>
            Location
          </label>
          <input
            id='location'
            {...register('location')}
            className={inputStyles}
          />
          {errors.location && (
            <p className='text-red500 text-sm'>{errors.location.message}</p>
          )}
        </div>
        <div className={inputDiv}>
          <label htmlFor='workMode' className={lableStyles}>
            Work Mode
          </label>
          <input
            id='workMode'
            {...register('workMode')}
            className={inputStyles}
          />
          {errors.workMode && (
            <p className='text-red500 text-sm'>{errors.workMode.message}</p>
          )}
        </div>
        <div className={inputDiv}>
          <label htmlFor='techincalSkills' className={lableStyles}>
            Technical Skills
          </label>
          <textarea
            id='techincalSkills'
            {...register('techincalSkills')}
            className={clsx(inputStyles, 'min-h-30')}
          />
          {errors.techincalSkills && (
            <p className='text-red500 text-sm'>
              {errors.techincalSkills.message}
            </p>
          )}
        </div>
        <div className='flex justify-end'>
          <Buttons
            type='submit'
            label={isLoading ? 'Posting..' : 'Post Job'}
            className='w-fit bg-primary! text-white font-bold text-xl rounded! cursor-pointer hover:text-black  hover:scale-105  hover:bg-white! hover:border! hover:border-primary!'
          />
        </div>
      </form>
    </main>
  )
}

export default PostJob
