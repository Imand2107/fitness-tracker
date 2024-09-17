/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import OnboardingFlow from '../components/OnboardingFlow'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      const storedUserData = localStorage.getItem('userData')
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData)
        if (parsedUserData.onboardingCompleted) {
          router.push('/dashboard')
        }
      }
    }
  }, [loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  return <OnboardingFlow />
}
