// Authentication Storage interface
export interface IAuthStorage {
  setAuth: (
    token: string,
    userType: 'creator' | 'recruiter',
    userData: any,
    email?: string
  ) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
  getUserType: () => 'creator' | 'recruiter' | null
  getUserData: <T = any>() => T | null
}
