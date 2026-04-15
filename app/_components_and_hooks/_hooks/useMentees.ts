'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/ _libs_and_schemas/context/auth-context'

interface Mentee {
  id: string
  name: string
  year: string
  major: string
  school: string
  status: string
  sessionsCompleted: number
  lastSessionDate: string
  nextSessionDate: string | null
  goals: string
  avatar: string
}

export function useMentees() {
  const { user } = useAuth()
  const [mentees, setMentees] = useState<Mentee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        if (!user?.id) {
          setLoading(false)
          return
        }

        // Fetch alumni profile first to get alumniId
        const profileRes = await fetch(`/api/auth/me`)
        if (!profileRes.ok) throw new Error('Failed to fetch user profile')

        const profileData = await profileRes.json()
        const alumniId = profileData.user?.alumniProfile?.id

        if (!alumniId) {
          setMentees([])
          setError(null)
          setLoading(false)
          return
        }

        const response = await fetch(`/api/mentees?alumniId=${alumniId}`)
        if (!response.ok) throw new Error('Failed to fetch mentees')

        const data = await response.json()
        setMentees(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setMentees([])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchMentees()
    }
  }, [user])

  return { mentees, loading, error }
}
