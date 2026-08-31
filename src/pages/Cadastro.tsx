import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import { signUp } from '@/services/auth'

export default function Cadastro() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError('Informe seu nome.')
      return
    }
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
      await signUp(name, email, password)
      navigate('/app/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar a conta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-void bg-phoenix-radial px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <Logo size={48} />
        <h1 className="mt-8 font-display text-2xl font-semibold text-white">Criar conta</h1>
        <p className="mt-1 text-sm text-mist">Leva menos de um minuto.</p>

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="label-eyebrow mb-2 block">Nome</label>
            <input
              type="text"
              className="input-field"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {error && <p className="text-sm text-alert">{error}</p>}

          <button type="submit" className="btn-primary mt-2 w-full" disabled={loading}>
            {loading ? 'CRIANDO...' : 'CRIAR CONTA'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-mist">
          Já tem conta?{' '}
          <Link to="/login" className="text-electric hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
