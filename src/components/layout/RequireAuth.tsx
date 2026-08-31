import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '@/hooks/useSession'

export default function RequireAuth() {
  const { session, loading } = useSession()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <p className="text-sm text-mist">Carregando...</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
