import { useEffect, useState } from 'react'

interface MentorshipRequestData {
  id: string
  studentName: string
  goal: string
  message?: string
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED'
  createdAt: string
}

interface UseRequestsReturn {
  requests: MentorshipRequestData[]
  loading: boolean
  error: string | null
  acceptRequest: (requestId: string) => Promise<void>
  declineRequest: (requestId: string) => Promise<void>
}

export function useRequests(): UseRequestsReturn {
  const [requests, setRequests] = useState<MentorshipRequestData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/mentor/requests')
        if (!response.ok) throw new Error('Failed to fetch requests')
        const data = await response.json()
        setRequests(data.requests || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setRequests([])
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const acceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/mentor/requests/${requestId}/accept`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to accept request')
      setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: 'ACCEPTED' } : r)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept request')
    }
  }

  const declineRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/mentor/requests/${requestId}/decline`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to decline request')
      setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: 'DECLINED' } : r)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decline request')
    }
  }

  return { requests, loading, error, acceptRequest, declineRequest }
}
