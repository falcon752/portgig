import * as Yup from 'yup'
export const validationSchema = Yup.object({
  full_name: Yup.string().required('Full name is required').min(2, 'Full name must be at least 2 characters').matches(/^[a-zA-Z\s-]+$/, 'Full name can only contain letters, spaces, and hyphens'),
  user_name: Yup.string().required('Username is required').min(3, 'Username must be at least 3 characters').max(30, 'Username must be at most 30 characters').matches(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and dashes').transform((value) => value?.toLowerCase()),
  email: Yup.string().email('Invalid email address').required('Email is required').transform((value) => value?.toLowerCase()),
  phoneNumber: Yup.string().required('Phone number is required').matches(/^([0]|[234])[0-9]{10}$/, 'Please enter a valid Nigerian phone number'),
  field: Yup.string().required('Field is required'),
  industry: Yup.string().required('Industry is required'),
  years_of_experience: Yup.string().required('Experience level is required'),
  state: Yup.string().required('State is required'),
  lga: Yup.string().required('LGA is required'),
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: Yup.string().required('Please confirm your password').oneOf([Yup.ref('password')], 'Passwords must match'),
  acceptedTerms: Yup.boolean().required('You must accept the terms').oneOf([true], 'You must accept the terms'),
})