/**
 * Reusable Filter Builders
 * Create filters for common queries without duplicating logic across routes
 */

export interface BaseFilter {
  skip?: number
  take?: number
  orderBy?: Record<string, 'asc' | 'desc'>
}

/**
 * Build a date range filter
 */
export function buildDateRangeFilter(startDate?: Date, endDate?: Date) {
  const filter: any = {}

  if (startDate) {
    filter.gte = startDate
  }

  if (endDate) {
    filter.lte = endDate
  }

  return Object.keys(filter).length > 0 ? filter : undefined
}

/**
 * Build a search filter that matches multiple fields
 */
export function buildSearchFilter(search: string, fields: string[]) {
  if (!search || search.trim().length === 0) {
    return undefined
  }

  return {
    OR: fields.map(field => ({
      [field]: {
        contains: search,
        mode: 'insensitive',
      },
    })),
  }
}

/**
 * Build a status filter
 */
export function buildStatusFilter(statuses: string | string[]) {
  if (!statuses) {
    return undefined
  }

  const statusArray = Array.isArray(statuses) ? statuses : [statuses]

  return statusArray.length === 1
    ? { status: statusArray[0] }
    : { status: { in: statusArray } }
}

/**
 * Combine multiple filters with AND logic
 */
export function mergeFilters(...filters: (Record<string, any> | undefined)[]): Record<string, any> | undefined {
  const validFilters = filters.filter(Boolean)

  if (validFilters.length === 0) {
    return undefined
  }

  if (validFilters.length === 1) {
    return validFilters[0]
  }

  return {
    AND: validFilters,
  }
}

/**
 * Build common mentor-related filters
 */
export interface MentorFilters {
  alumniId?: string
  skills?: string[]
  availability?: boolean
  yearsOfExperience?: { min?: number; max?: number }
}

export function buildMentorFilter(filters: MentorFilters) {
  const conditions: any[] = []

  if (filters.alumniId) {
    conditions.push({ id: filters.alumniId })
  }

  if (filters.availability !== undefined) {
    conditions.push({ isAvailable: filters.availability })
  }

  if (filters.yearsOfExperience) {
    const expFilter: any = {}
    if (filters.yearsOfExperience.min !== undefined) {
      expFilter.gte = filters.yearsOfExperience.min
    }
    if (filters.yearsOfExperience.max !== undefined) {
      expFilter.lte = filters.yearsOfExperience.max
    }
    if (Object.keys(expFilter).length > 0) {
      conditions.push({ yearsOfExperience: expFilter })
    }
  }

  if (filters.skills && filters.skills.length > 0) {
    conditions.push({
      skills: {
        hasSome: filters.skills,
      },
    })
  }

  return conditions.length > 0 ? (conditions.length === 1 ? conditions[0] : { AND: conditions }) : undefined
}

/**
 * Build session filters
 */
export interface SessionFilters {
  status?: string | string[]
  mentorId?: string
  studentId?: string
  dateRange?: { start?: Date; end?: Date }
}

export function buildSessionFilter(filters: SessionFilters) {
  const conditions: any[] = []

  if (filters.status) {
    const statusFilter = buildStatusFilter(filters.status)
    if (statusFilter) conditions.push(statusFilter)
  }

  if (filters.mentorId) {
    conditions.push({ mentorId: filters.mentorId })
  }

  if (filters.studentId) {
    conditions.push({ studentId: filters.studentId })
  }

  if (filters.dateRange) {
    const dateFilter = buildDateRangeFilter(filters.dateRange.start, filters.dateRange.end)
    if (dateFilter) {
      conditions.push({ startTime: dateFilter })
    }
  }

  return conditions.length > 0 ? (conditions.length === 1 ? conditions[0] : { AND: conditions }) : undefined
}
