import { useEffect, useState } from 'react'

interface DashboardMetrics {
  totalMentees?: number
  activeMentorCount?: number
  pendingRequestsCount: number
  upcomingSessionsCount: number
  completedSessionsCount?: number
  avgRating?: number
}

interface UseDashboardMetricsReturn {
  metrics: DashboardMetrics | null
  loading: boolean
  error: string | null
}

export function useDashboardMetrics(role: 'STUDENT' | 'ALUMNI' | 'ADMIN'): UseDashboardMetricsReturn {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        const endpoint = role === 'STUDENT' ? '/api/student/dashboard' : '/api/mentor/dashboard'
        const response = await fetch(endpoint)
        if (!response.ok) throw new Error('Failed to fetch dashboard metrics')
        const data = await response.json()
        
        // Normalize the response to metrics format
        const normalizedMetrics: DashboardMetrics = {
          totalMentees: data.totalMentees,
          activeMentorCount: data.activeMentorCount,
          pendingRequestsCount: data.pendingRequests?.length || 0,
          upcomingSessionsCount: data.upcomingSessions?.length || 0,
          completedSessionsCount: data.sessionStats?.completed,
          avgRating: data.avgRating,
        }
        
        setMetrics(normalizedMetrics)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setMetrics(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [role])

  return { metrics, loading, error }
}
