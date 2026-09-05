import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from '@/services/auth'
import { useProfile } from '@/hooks/useProfile'
import { useDevice } from '@/hooks/useDevice'
import { setDeviceImei } from '@/services/devices'
import {
  getRecoveryContacts,
  createRecoveryContact,
  deleteRecoveryContact,
} from '@/services/recoveryContacts'
import type { RecoveryContact } from '@/types'

const CAKTO_CHECKOUT_URL = 'https://pay.cakto.com.br/fs5aue5_1078174'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

function planBadge(status: 'trial' | 'active' | 'inactive', subscriptionEnd: string | null) {
  const trialExpired = status === 'trial' && subscriptionEnd && new Date(subscriptionEnd) < new Date()

  if (status === 'active') {
    return { label: 'PREMIUM ATIVO', className: 'bg-safe/10 text-safe' }
  }
  if (status === 'trial' && !trialExpired) {
    return { label: 'TESTE GRÁTIS', className: 'bg-electric/10 text-electric' }
  }
  return { label: 'PLANO GRATUITO', className: 'bg-white/5 text-mist' }
}

function isValidImei(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.length === 15
}

export default function ConfiguracoesPage() {
  const navigate = useNavigate()
  const { profile, loading } = useProfile()
  const { device, loading: loadingDevice } = useDevice()

  const [contacts, setContacts] = useState<RecoveryContact[]>([])
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)

  const [imei, setImei] = useState('')
  const [savingImei, setSavingImei] = useState(false)
  const [imeiSaved, setImeiSaved] = useState(false)
  const [imeiError, setImeiError] = useState<string | null>(null)

  const loadContacts = async () => {
    setLoadingContacts(true)
    const data = await getRecoveryContacts()
    setContacts(data)
    setLoadingContacts(false)
  }

  useEffect(() => {
    loadContacts()
  }, [])

  useEffect(() => {
    if (device?.imei) {
      setImei(device.imei)
    }
  }, [device?.imei])

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

  const handleSaveImei = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!device) return
    setImeiError(null)
    setImeiSaved(false)

    if (!isValidImei(imei)) {
      setImeiError('O IMEI deve ter 15 dígitos. Digite *#06# no discador para ver o seu.')
      return
    }

    setSavingImei(true)
    try {
      await setDeviceImei(device.id, imei.replace(/\D/g, ''))
      setImeiSaved(true)
    } catch (err) {
      setImeiError(err instanceof Error ? err.message : 'Não foi possível salvar o IMEI.')
    } finally {
      setSavingImei(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  function handleSubscribe() {
    const params = new URLSearchParams()
    if (profile?.name) params.set('name', profile.name)
    if (profile?.email) params.set('email', profile.email)
    const url = `${CAKTO_CHECKOUT_URL}?${params.toString()}`
    window.open(url, '_blank')
  }

  const badge = profile ? planBadge(profile.subscriptionStatus, profile.subscriptionEnd) : null
  const isPremiumActive =
    profile?.subscriptionStatus === 'active' ||
    (profile?.subscriptionStatus === 'trial' &&
      profile.subscriptionEnd &&
      new Date(profile.subscriptionEnd) >= new Date())

  return (
    <div className="px-5 py-6 md:px-8 md:py-8 space-y-6">
      <div>
        <p className="label-eyebrow">Conta</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-white">
          Configurações
        </h1>
      </div>

      {/* Card de assinatura */}
      <div className="card p-5 space-y-3">
        <p className="text-sm text-white">
          {loading ? 'Carregando...' : profile?.name ?? '-'}
        </p>
        <p className="text-xs text-mist">
          {loading ? '' : profile?.email ?? ''}
        </p>

        {!loading && badge && (
          <span className={`inline-block rounded-full px-2.5 py-1 font-mono text-[11px] ${badge.className}`}>
            {badge.label}
          </span>
        )}

        {!loading && profile?.subscriptionStatus === 'trial' && profile.subscriptionEnd && (
          <p className="text-xs text-mist">
            {isPremiumActive
              ? `Seu teste grátis termina em ${formatDate(profile.subscriptionEnd)}.`
              : `Seu teste grátis terminou em ${formatDate(profile.subscriptionEnd)}.`}
          </p>
        )}

        {!loading && !isPremiumActive && (
          <button onClick={handleSubscribe} className="btn-primary mt-2 w-full">
            Assinar Premium
          </button>
        )}
      </div>

      {/* Card de IMEI */}
      <div className="card p-5 space-y-3">
        <h2 className="text-lg font-semibold text-white">IMEI do dispositivo</h2>
        <p className="text-xs text-mist">
          Guarde o IMEI aqui para usar em um Boletim de Ocorrência ou pedido de bloqueio na
          operadora, caso precise. Para descobrir o seu, digite <strong>*#06#</strong> no
          discador do telefone.
        </p>

        {loadingDevice ? (
          <p className="text-xs text-mist">Carregando dispositivo...</p>
        ) : (
          <form onSubmit={handleSaveImei} className="space-y-3">
            <input
              type="text"
              inputMode="numeric"
              placeholder="000000000000000"
              value={imei}
              onChange={(e) => {
                setImei(e.target.value)
                setImeiSaved(false)
              }}
              maxLength={17}
              className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white border border-white/10 focus:outline-none focus:border-electric"
            />
            {imeiError && <p className="text-xs text-red-400">{imeiError}</p>}
            {imeiSaved && <p className="text-xs text-safe">IMEI salvo com sucesso.</p>}
            <button
              type="submit"
              disabled={savingImei || !device}
              className="w-full rounded-md bg-electric px-4 py-2 text-sm font-medium text-black hover:bg-electric/90 disabled:opacity-50"
            >
              {savingImei ? 'Salvando...' : 'Salvar IMEI'}
            </button>
          </form>
        )}
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
