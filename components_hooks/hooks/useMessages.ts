import { useEffect, useState } from 'react'

interface MessageData {
  id: string
  content: string
  timestamp: string
  sender: string
  senderId: string
  isOwn: boolean
}

interface UseMessagesReturn {
  messages: MessageData[]
  loading: boolean
  error: string | null
  sendMessage: (body: string) => Promise<void>
}

export function useMessages(conversationId: string | null): UseMessagesReturn {
  const [messages, setMessages] = useState<MessageData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      return
    }

    const fetchMessages = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/messages/conversations/${conversationId}`)
        if (!response.ok) throw new Error('Failed to fetch messages')
        const data = await response.json()
        setMessages(data.messages || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setMessages([])
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [conversationId])

  const sendMessage = async (body: string) => {
    if (!conversationId || !body.trim()) {
      setError('Invalid message or conversation')
      return
    }

    try {
      const response = await fetch(`/api/messages/conversations/${conversationId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })

      if (!response.ok) throw new Error('Failed to send message')
      const data = await response.json()
      setMessages([...messages, data.message])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    }
  }

  return { messages, loading, error, sendMessage }
}
