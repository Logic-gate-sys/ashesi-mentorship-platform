import { redirect } from 'next/navigation'
import { cookies }  from 'next/headers'
import AppShell from '../_components/layout/Appshell';
import { decodeJWT } from '../_lib/jwt';



export default async function DashboardLayout({ children }: {children: React.ReactNode}) {
//   const cookieStore = await cookies()
//   const token       = cookieStore.get('token')?.value || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl83ODkwMTIzNDUiLCJyb2xlIjoiU1RVREVOVCIsImZpcnN0TmFtZSI6IkphbmUiLCJsYXN0TmFtZSI6IkRvZSIsImV4cCI6MTcxMTQwNDAwMH0.dummy-signature'

//   // No token → back to login
//   if (!token) redirect('/login')

//   const payload = decodeJWT(token)

//   // Malformed or expired token → back to login
//   if (!payload || payload.exp * 1000 < Date.now()) redirect('/login')

//   const { role, firstName, lastName } = payload
//   const name     = `${firstName} ${lastName}`
//   const initials = `${firstName[0]}${lastName[0]}`.toUpperCase()
const role = "STUDENT";
const initials = 'JL'

  return (
    <AppShell
      role={role === 'ADMIN' ? 'ALUMNI' : role}
      name={"Jane"}
      initials={initials}
    >
      {children}
    </AppShell>
  )
}