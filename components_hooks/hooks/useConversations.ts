import { useEffect, useState } from 'react'

interface ConversationData {
  id: string
  participantName: string
  participantImage: string
  lastMessage: string
  timestamp: string
  isOnline: boolean
  unreadCount: number
}

interface UseConversationsReturn {
  conversations: ConversationData[]
  loading: boolean
  error: string | null
}

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/messages/conversations')
        if (!response.ok) throw new Error('Failed to fetch conversations')
        const data = await response.json()
        setConversations(data.conversations || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setConversations([])
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  return { conversations, loading, error }
}
