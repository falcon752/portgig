import {
  recruiterSignInSchema,
  recruiterSignUpSchema,
  signInSchema,
  signUpSchema,
} from '@/src/app/(auth)/zodSchemas'
import { z } from 'zod'

// Auth Types
export type UserType = 'creator' | 'recruiter'

export interface BaseUser {
  id: string
  email: string
  full_name: string
  user_name: string
  user_type: UserType
  created_at: string
  updated_at: string
}

export interface CreatorUser extends BaseUser {
  user_type: 'creator'
  field?: string
  industry?: string
  years_of_experience?: string
  state?: string
  lga?: string
  bio?: string
  portfolio?: any[]
}

export interface RecruiterUser extends BaseUser {
  user_type: 'recruiter'
  company_name: string
  phone_number: string
  company_address?: string
  company_website?: string
  company_size?: string
}

export type User = CreatorUser | RecruiterUser

// Auth Request/Response Types
export interface ApiResponse<T = any> {
  profile: any
  status: number
  message: string
  data?: T
  error?: string
  name?: string
  cause?: any
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface BaseRegistrationData extends LoginCredentials {
  full_name: string
  user_name: string
}

export interface CreatorRegistrationData extends BaseRegistrationData {
  field?: string
  industry?: string
  years_of_experience?: string
  state?: string
  lga?: string
  bio?: string
}

export interface RecruiterRegistrationData
  extends Omit<BaseRegistrationData, 'user_name'> {
  company_name: string
  industry: string
  about_us: string
}

// Form Types
export type AuthFormType =
  | 'sign-in'
  | 'sign-up'
  | 'recruiter-sign-in'
  | 'recruiter-sign-up'

export interface CreatorFormData extends CreatorRegistrationData {
  confirmPassword?: string
  acceptedTerms?: boolean
  phoneNumber?: string // for form handling
}

export interface RecruiterFormData extends RecruiterRegistrationData {
  confirmPassword?: string
  acceptedTerms?: boolean
}

export type FormData = CreatorFormData | RecruiterFormData

// Authentication State
export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export type SignInData = z.infer<typeof signInSchema>
export type SignUpData = z.infer<typeof signUpSchema>
export type RecruiterSignInData = z.infer<typeof recruiterSignInSchema>
export type RecruiterSignUpData = z.infer<typeof recruiterSignUpSchema>
