import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from '@/services/auth'
import { useProfile } from '@/hooks/useProfile'
import {
  getRecoveryContacts,
  createRecoveryContact,
  deleteRecoveryContact,
} from '@/services/recoveryContacts'
import type { RecoveryContact } from '@/types'

export default function ConfiguracoesPage() {
  const navigate = useNavigate()
  const { profile, loading } = useProfile()

  const [contacts, setContacts] = useState<RecoveryContact[]>([])
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)

  const loadContacts = async () => {
    setLoadingContacts(true)
    const data = await getRecoveryContacts()
    setContacts(data)
    setLoadingContacts(false)
  }

  useEffect(() => {
    loadContacts()
  }, [])

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return

    setSaving(true)
    const newContact = await createRecoveryContact({ name, phone })
    if (newContact) {
      setName('')
      setPhone('')
      await loadContacts()
    }
    setSaving(false)
  }

  const handleDeleteContact = async (id: string) => {
    const success = await deleteRecoveryContact(id)
    if (success) {
      setContacts((prev) => prev.filter((c) => c.id !== id))
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="px-5 py-6 md:px-8 md:py-8 space-y-6">
      <div>
        <p className="label-eyebrow">Conta</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-white">
          Configurações
        </h1>
      </div>

      <div className="card p-5">
        <p className="text-sm text-white">
          {loading ? 'Carregando...' : profile?.name ?? '-'}
        </p>
        <p className="text-xs text-mist">
          {loading ? '' : profile?.email ?? ''}
        </p>
        <p className="mt-2 inline-block rounded-full bg-electric/10 px-2.5 py-1 font-mono text-[11px] text-electric">
          Plano {profile?.plan ?? 'FREE'}
        </p>
      </div>

      {/* Seção de Contatos de Emergência */}
      <div className="card p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">Contatos de Emergência</h2>

        <form onSubmit={handleAddContact} className="space-y-3">
          <input
            type="text"
            placeholder="Nome do contato"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white border border-white/10 focus:outline-none focus:border-electric"
          />
          <input
            type="text"
            placeholder="Telefone (ex: 83999999999)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white border border-white/10 focus:outline-none focus:border-electric"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-electric px-4 py-2 text-sm font-medium text-black hover:bg-electric/90 disabled:opacity-50"
          >
            {saving ? 'Adicionando...' : 'Adicionar Contato'}
          </button>
        </form>

        <div className="space-y-2 pt-2">
          {loadingContacts ? (
            <p className="text-xs text-mist">Carregando contatos...</p>
          ) : contacts.length === 0 ? (
            <p className="text-xs text-mist">Nenhum contato cadastrado.</p>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/5"
              >
                <div>
                  <p className="text-sm font-medium text-white">{contact.name}</p>
                  <p className="text-xs text-mist">{contact.phone}</p>
                </div>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Excluir
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <button className="btn-ghost w-full" onClick={handleSignOut}>
        Sair da conta
      </button>
    </div>
  )
}
