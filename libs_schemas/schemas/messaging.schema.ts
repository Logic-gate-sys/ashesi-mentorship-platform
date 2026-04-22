import { z } from 'zod';

/**
 * Conversation Schemas
 */

export const createConversationSchema = z.object({
  participantIds: z
    .array(z.string().uuid('Invalid user ID'))
    .min(2, 'At least 2 participants required')
    .max(10, 'Maximum 10 participants'),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;

/**
 * Message Schemas
 */

export const messageTypeSchema = z.enum(['TEXT', 'FILE', 'SYSTEM']);

export const createMessageSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
  type: messageTypeSchema.default('TEXT'),
  body: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),
  fileUrl: z
    .string()
    .url('Invalid file URL')
    .optional()
    .refine(
      (val) => !val || /\.(pdf|doc|docx|xls|xlsx|png|jpg|jpeg|gif)$/i.test(val),
      'Invalid file type'
    ),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

/**
 * List Messages Query
 */
export const listMessagesQuerySchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListMessagesQuery = z.infer<typeof listMessagesQuerySchema>;

/**
 * List Conversations Query
 */
export const listConversationsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListConversationsQuery = z.infer<typeof listConversationsQuerySchema>;

/**
 * Mark Conversation as Read
 */
export const markConversationReadSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
});

export type MarkConversationReadInput = z.infer<typeof markConversationReadSchema>;
