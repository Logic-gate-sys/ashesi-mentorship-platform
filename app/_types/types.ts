
export interface Request {
  id:       string
  student:  string
  initials: string
  avatar:   string
  major:    string
  goal:     string
  date:     string
  status:   'PENDING' | 'ACCEPTED' | 'DECLINED'
}

export interface Session {
  id:       string
  title:    string
  subtitle: string
  student:  string
  initials: string
  avatar:   string
  duration: string
  date:     string
}

export interface Mentee {
  id:       string
  name:     string
  major:    string
  initials: string
  avatar:   string
  industry: string
  tag:      string
  progress: number
  sessions: number
  total:    number
}

