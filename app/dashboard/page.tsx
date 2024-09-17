'use client'

import { useAuth } from '../../contexts/AuthContext'
import MobileDashboard from '../../components/MobileDashboard'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/') // Redirect to home if not logged in
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null // This will be handled by the useEffect above
  }

  return <MobileDashboard />
}
