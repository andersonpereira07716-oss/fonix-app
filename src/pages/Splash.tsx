import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '@/components/ui/Logo'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/onboarding'), 1800)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-void bg-phoenix-radial">
      <div className="animate-[fadeIn_0.8s_ease-out]">
        <Logo size={88} />
      </div>
      <h1 className="mt-6 animate-[fadeIn_0.8s_ease-out_0.15s_both] font-display text-3xl font-semibold tracking-[0.15em] text-white">
        FÔNIX
      </h1>
      <p className="mt-2 animate-[fadeIn_0.8s_ease-out_0.3s_both] text-sm text-mist">
        Proteção inteligente para smartphones.
      </p>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
