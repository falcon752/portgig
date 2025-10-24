import * as Yup from 'yup'

export const recruiterSignupSchema = Yup.object().shape({
  full_name: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Full name is required'),
  company_name: Yup.string()
    .min(2, 'Company name is too short')
    .max(100, 'Company name is too long')
    .required('Company name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone_number: Yup.string()
    .matches(/^[0-9+\-() ]+$/, 'Invalid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  industry: Yup.string()
    .min(2, 'Industry is too short')
    .max(50, 'Industry is too long')
    .required('Industry is required'),
  bio: Yup.string()
    .min(50, 'Bio must be at least 50 characters')
    .max(500, 'Bio cannot exceed 500 characters')
    .required('Company bio is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .required('Password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  acceptedTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms')
    .required('You must accept the terms'),
})

export interface RecruiterSignupFormValues {
  full_name: string
  company_name: string
  email: string
  phone_number: string
  industry: string
  bio: string
  password: string
  confirm_password: string
  acceptedTerms: boolean
}
