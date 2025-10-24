'use client'

import { Buttons } from '@/src/components/export_components'
import { useAppSelector } from '@/src/redux/hooks'
import { industryOptions } from '@/src/utils/industryData'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import NaijaStates from "naija-state-local-government"
import * as z from 'zod'

// Define the form schema
const formSchema = z.object({
  phone: z.string().optional(),
  state: z.string().optional(),
  lga: z.string().optional(),
  industry: z.string().optional(),
  field: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

type FieldType = keyof typeof industryOptions

interface LGAResult {
  state: string
  lgas: string[]
}

const EditPortfolioPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedState, setSelectedState] = useState('')
  const [selectedField, setSelectedField] = useState<FieldType | ''>('')
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    state: '',
    lga: '',
    industry: '',
    field: '',
  })
  const { profile } = useAppSelector((state) => state.user)

  // Get states and LGAs using naija-state-local-government
  const states = NaijaStates.states()
  const lgas = selectedState ? (NaijaStates.lgas(selectedState) as unknown as LGAResult).lgas : []

  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: profile?.profile?.phone_number || '',
      state: profile?.profile?.location?.state || '',
      lga: profile?.profile?.location?.lga || '',
      industry: profile?.profile?.industry || '',
      field: profile?.profile?.field || '',
    },
  })

  useEffect(() => {
    if (profile) {
      const serverField = profile.profile?.field || ''
      const serverIndustry = profile.profile?.industry || ''

      const isValidField = serverField in industryOptions
      const isValidIndustry =
        isValidField &&
        industryOptions[serverField as FieldType]?.includes(serverIndustry)

      setFormData({
        phone: profile.profile?.phone_number || '',
        state: profile.profile?.location?.state || '',
        lga: profile.profile?.location?.lga || '',
        industry: isValidIndustry ? serverIndustry : '',
        field: isValidField ? serverField : '',
      })
      if (profile.profile?.location?.state) {
        setSelectedState(profile.profile.location.state)
      }
      if (isValidField) {
        setSelectedField(serverField as FieldType)
      }
    }
  }, [profile])

  // Handle input changes and update formData state
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'state' ? { lga: '' } : {}),
      ...(name === 'field' ? { industry: '' } : {}),
    }))
    if (name === 'state') {
      setSelectedState(value)
    }
    if (name === 'field') {
      setSelectedField(value as FieldType)
    }
  }

  const updateProfile = async (data: FormData) => {
    const updatedData = {
      profile: {
        phone_number: data.phone || '',
        location: {
          state: data.state || '',
          lga: data.lga || '',
        },
        industry: data.industry || '',
        field: data.field || '',
      },
    }

    console.log('data', updatedData)

    // try {
    //   const response = await CreatorAuth.updateProfile(updatedData, 'RESUME')

    //   if (response.status === 200) {
    //     toast.success(response.message || 'Profile updated successfully')
    //   } else {
    //     throw new Error(response.message || 'Failed to update profile')
    //   }
    // } catch (error: unknown) {
    //   throw new Error((error as Error).message || 'Failed to update profile')
    // }
  }

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      await updateProfile(formData)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      // router.push('/creative-dashboard/profile-saved')
      reset()
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col text-black gap-5 font-inter'
    >
      <h4 className='text-2xl font-bold'>Edit profile</h4>

      {/* Personal info container */}
      <div className='bg-white shadow rounded-lg p-5 flex flex-col gap-5'>
        <header className='w-full flex justify-between items-center'>
          <h2 className='text-sm lg:text-lg font-bold'>Edit Portfolio</h2>
          <Buttons
            label='Edit'
            className='rounded-lg h-12-sm text-base'
            onClick={() => {}}
          />
        </header>

        <div className='flex flex-col gap-5 w-full'>
          <div className='flex flex-col gap-2 w-full'>
            <label htmlFor='phone'>Phone Number:</label>
            <input
              {...register('phone')}
              type='text'
              className='text-sm bg-white p-2 border border-gray-300 rounded-lg h-12'
              placeholder='Phone Number'
              onChange={handleInputChange}
            />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 w-full'>
            <div className='flex flex-col gap-2'>
              <h2 className='font-light'>Field</h2>
              <select
                {...register('field')}
                className='text-sm bg-white p-2 border border-gray-300 rounded-lg h-12'
                onChange={handleInputChange}
                value={formData.field}
              >
                <option value=''>Select Field</option>
                {Object.keys(industryOptions).map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex flex-col gap-2'>
              <h2 className='font-light'>Industry</h2>
              <select
                {...register('industry')}
                className='text-sm bg-white p-2 border border-gray-300 rounded-lg h-12'
                onChange={handleInputChange}
                value={formData.industry}
                disabled={!selectedField}
              >
                <option value=''>Select Industry</option>
                {selectedField &&
                  industryOptions[selectedField]?.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 w-full'>
            <div className='flex flex-col gap-2'>
              <h2 className='font-light'>State</h2>
              <select
                {...register('state')}
                className='text-sm bg-white p-2 border border-gray-300 rounded-lg h-12'
                onChange={handleInputChange}
                value={formData.state}
              >
                <option value=''>Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex flex-col gap-2'>
              <h2 className='font-light'>LGA</h2>
              <select
                {...register('lga')}
                className='text-sm bg-white p-2 border border-gray-300 rounded-lg h-12'
                onChange={handleInputChange}
                value={formData.lga}
                disabled={!selectedState}
              >
                <option value=''>
                  {selectedState ? 'Select LGA' : 'Please select a state first'}
                </option>
                {lgas.map((lga) => (
                  <option key={lga} value={lga}>
                    {lga}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Buttons
            type='submit'
            label={isLoading ? 'Saving...' : 'Save changes'}
            className='bg-primary! w-fit text-white self-end rounded-lg h-12-sm font-raleway font-semibold'
          />
        </div>
      </div>
    </form>
  )
}

export default EditPortfolioPage