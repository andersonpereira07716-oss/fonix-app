import { useNavigate } from 'react-router-dom'
import { signOut } from '@/services/auth'
import { useProfile } from '@/hooks/useProfile'

export default function ConfiguracoesPage() {
  const navigate = useNavigate()
  const { profile, loading } = useProfile()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <p className="label-eyebrow">Conta</p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-white">Configurações</h1>

      <div className="card mt-6 p-5">
        <p className="text-sm text-white">{loading ? 'Carregando...' : profile?.name ?? '—'}</p>
        <p className="text-xs text-mist">{loading ? '' : profile?.email ?? ''}</p>
        <p className="mt-2 inline-block rounded-full bg-electric/10 px-2.5 py-1 font-mono text-[11px] text-electric">
          Plano {profile?.plan ?? 'FREE'}
        </p>
      </div>

      <div className="card mt-4 divide-y divide-white/5">
        {['Perfil', 'Contato de recuperação', 'Notificações', 'Privacidade e permissões', 'Planos'].map(
          (item) => (
            <button
              key={item}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-white hover:bg-white/5"
            >
              {item}
              <span className="text-mist">→</span>
            </button>
          ),
        )}
      </div>

      <button className="btn-ghost mt-4 w-full" onClick={handleSignOut}>
        Sair da conta
      </button>
    </div>
  )
}
