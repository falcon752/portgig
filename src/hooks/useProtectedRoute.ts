import { User } from '@/types/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AuthStorage from '../lib/requests/auth.new'

interface UseProtectedRouteProps {
  requiredUserType?: 'creator' | 'recruiter'
}

export const useProtectedRoute = ({
  requiredUserType,
}: UseProtectedRouteProps = {}) => {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = AuthStorage.isAuthenticated()
    const userData = AuthStorage.getUserData<User>()
    const userType = userData?.user_type

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (requiredUserType && userType !== requiredUserType) {
      router.push(`/${requiredUserType}/login`)
    }
  }, [router, requiredUserType])

  return AuthStorage.getUserData<User>()
}
