import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import { signIn } from '@/services/auth'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) {
      setError('Informe um email válido.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/app/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-void bg-phoenix-radial px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <Logo size={48} />
        <h1 className="mt-8 font-display text-2xl font-semibold text-white">Entrar</h1>
        <p className="mt-1 text-sm text-mist">Acesse sua conta FÔNIX.</p>

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="label-eyebrow mb-2 block">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-eyebrow mb-2 block">Senha</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {error && <p className="text-sm text-alert">{error}</p>}

          <button type="button" className="self-end text-xs text-mist hover:text-white">
            Esqueci minha senha
          </button>

          <button type="submit" className="btn-primary mt-2 w-full" disabled={loading}>
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-mist">
          Não tem conta?{' '}
          <Link to="/cadastro" className="text-electric hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
