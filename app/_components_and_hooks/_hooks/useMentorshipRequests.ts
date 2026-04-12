'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/ _libs_and_schemas/context/auth-context'

interface MentorshipRequest {
  id: string
  studentName: string
  studentYear: string
  studentMajor: string
  studentInterests: string[]
  message: string
  timestamp: string
  status: string
}

export function useMentorshipRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<MentorshipRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (!user?.id) {
          setLoading(false)
          return
        }

        const response = await fetch(
          `/api/mentorship-requests?userId=${user.id}`
        )
        if (!response.ok) throw new Error('Failed to fetch requests')

        const data = await response.json()
        setRequests(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setRequests([])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchRequests()
    }
  }, [user])

  return { requests, loading, error }
}
