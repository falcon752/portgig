import apiClient from './apiUtil'

type ErrorWithResponse = {
  response?: {
    data?: {
      message?: string
    }
  }
}

const extractErrorMessage = (
  error: unknown,
  fallback = 'Request failed'
): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const typedError = error as ErrorWithResponse
    const message = typedError.response?.data?.message
    if (typeof message === 'string') {
      return message
    }
  }
  return fallback
}

// CREATOR SIGN IN
export const creatorSignin = async (data: {
  email: string
  password: string
}) => {
  try {
    const response = await apiClient.post('creator/login', data)
    console.log(response.status)
    const { accessToken, refreshToken } = response.data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('userEmail', data.email)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }

    return accessToken
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, 'creator Signin request failed'))
  }
}

// RECRUITER SIGN IN
export const recruiterSignin = async (data: {
  email: string
  password: string
}) => {
  try {
    const response = await apiClient.post('recruiter/login', data)
    console.log(response.status)
    const { accessToken, refreshToken } = response.data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('userEmail', data.email) 
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }

    return accessToken
  } catch (error: unknown) {
    throw new Error(
      extractErrorMessage(error, 'recruiter Signin request failed')
    )
  }
}

// CREATOR SIGN UP
export const creatorSignUp = async (data: {
  fullName?: string
  username: string
  phoneNumber: string
  email: string
  password: string
  industry: string
  yearOfExperience: string
  location: string
  confirmPassword: string
}) => {
  try {
    const response = await apiClient.post('creator/register', data)
    console.log(response.status)
    const { accessToken, refreshToken } = response.data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('userEmail', data.email)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }

    return accessToken
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, 'creator Signup request failed'))
  }
}

// RECRUITER SIGN UP
export const recruiterSignUp = async (data: {
  fullName?: string
  username: string
  phoneNumber: string
  email: string
  password: string
  industry: string
  yearOfExperience: string
  location: string
  confirmPassword: string
}) => {
  try {
    const response = await apiClient.post('recruiter/register', data)
    console.log(response.status)
    const { accessToken, refreshToken } = response.data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('userEmail', data.email)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }

    return accessToken
  } catch (error: unknown) {
    throw new Error(
      extractErrorMessage(error, 'recruiter Signup request failed')
    )
  }
}
