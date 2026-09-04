import { useEffect, useState, useCallback } from 'react'
import { ShieldAlert, X } from 'lucide-react'
import { useDevice } from '@/hooks/useDevice'
import { getActiveIncident, createIncident, resolveIncident } from '@/services/incidents'
import { logEvent, getEvents } from '@/services/events'
import { listLocationHistory, captureBrowserLocation } from '@/services/locations'
import { supabase } from '@/lib/supabaseClient'
import { buildIncidentReport } from '@/utils/incidentReport'
import type { Incident, IncidentStatus } from '@/types'

export default function FenixPage() {
  const { device, loading: loadingDevice } = useDevice()
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reportText, setReportText] = useState<string | null>(null)
  const [generatingReport, setGeneratingReport] = useState(false)

  const loadIncident = useCallback(async () => {
    setLoading(true)
    try {
      const active = await getActiveIncident()
      setIncident(active)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar o status.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadIncident()
  }, [loadIncident])

  async function activate() {
    if (!device) return
    setBusy(true)
    setError(null)
    try {
      const created = await createIncident({ status: 'PERDIDO', deviceId: device.id })
      if (!created) throw new Error('Não foi possível criar o incidente.')
      await logEvent({
        deviceId: device.id,
        type: 'CRITICO',
        description: 'Modo Fênix ativado — possível evento de segurança',
        locationId: null,
      })
      try { await captureBrowserLocation(device.id) } catch (locErr) { console.warn('Falha ao capturar localizacao no Modo Fenix:', locErr) }
      setIncident(created)
      setShowConfirm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível ativar o Modo Fênix.')
    } finally {
      setBusy(false)
    }
  }

  async function markAs(status: IncidentStatus) {
    if (!incident) return
    setBusy(true)
    setError(null)
    try {
      const { error } = await supabase.from('incidents').update({ status }).eq('id', incident.id)
      if (error) throw error
      setIncident({ ...incident, status })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar o status.')
    } finally {
      setBusy(false)
    }
  }

  async function handleClose() {
    if (!incident) return
    setBusy(true)
    setError(null)
    try {
      const ok = await resolveIncident(incident.id)
      if (!ok) throw new Error('Não foi possível encerrar o incidente.')
      setIncident(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível encerrar o incidente.')
    } finally {
      setBusy(false)
    }
  }

  async function handleGenerateReport() {
    if (!device || !incident) return
    setGeneratingReport(true)
    setError(null)
    try {
      const openedAt = new Date(incident.openedAt).getTime()
      const closedAt = incident.closedAt ? new Date(incident.closedAt).getTime() : Date.now()

      const [allEvents, allLocations] = await Promise.all([
        getEvents(),
        listLocationHistory(device.id, 100),
      ])

      const events = allEvents.filter((e) => {
        const t = new Date(e.occurredAt).getTime()
        return e.deviceId === device.id && t >= openedAt && t <= closedAt
      })
      const locations = allLocations.filter((l) => {
        if (!l.capturedAt) return false
        const t = new Date(l.capturedAt).getTime()
        return t >= openedAt && t <= closedAt
      })

      const text = buildIncidentReport(device, incident, events, locations)
      setReportText(text)

      if (navigator.share) {
        try {
          await navigator.share({ title: 'Relatório de incidente — FÔNIX', text })
        } catch {
          // Usuário cancelou o compartilhamento ou o navegador não suporta — sem problema,
          // o texto continua disponível na tela para cópia manual.
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível gerar o relatório.')
    } finally {
      setGeneratingReport(false)
    }
  }

  async function copyReport() {
    if (!reportText) return
    try {
      await navigator.clipboard.writeText(reportText)
    } catch {
      // Alguns WebViews não suportam clipboard API — o texto continua visível para
      // o usuário selecionar e copiar manualmente.
    }
  }

  const isLoading = loading || loadingDevice
  const isActive = Boolean(incident)

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <p className="label-eyebrow">Modo Fênix</p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-white">
        Central de recuperação
      </h1>

      {error && (
        <p className="mt-4 rounded-xl border border-alert/20 bg-alert/10 px-4 py-3 text-sm text-alert">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="card mt-6 flex h-40 items-center justify-center">
          <p className="text-sm text-mist">Carregando...</p>
        </div>
      ) : !isActive ? (
        <div className="card mt-6 flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-alert/10">
            <ShieldAlert className="text-alert" size={30} />
          </div>
          <p className="max-w-xs text-sm text-mist">
            Ative o Modo Fênix somente se acredita que seu dispositivo foi perdido ou roubado.
          </p>
          <button
            className="btn-danger w-full max-w-xs"
            onClick={() => setShowConfirm(true)}
            disabled={busy}
          >
            🚨 ATIVAR MODO FÊNIX
          </button>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          <div className="card flex items-center gap-3 border-alert/30 p-5">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-alert" />
            <p className="font-display text-sm font-semibold text-alert">🔴 INCIDENTE ATIVO</p>
          </div>

          <div className="card grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
            <ActionRow label="📍 Última localização" />
            <ActionRow label="🔒 Bloquear dispositivo" limited />
            <ActionRow label="🔊 Tentar reproduzir som" limited />
            <ActionRow label="📞 Contato de recuperação" />
            <ActionRow
              label={generatingReport ? '📋 Gerando relatório...' : '📋 Gerar relatório'}
              onClick={handleGenerateReport}
              disabled={generatingReport}
            />
          </div>

          <div className="flex gap-3">
            <button
              className="btn-ghost flex-1"
              onClick={() => markAs('ROUBADO')}
              disabled={busy}
            >
              Marcar como roubado
            </button>
            <button
              className="btn-ghost flex-1"
              onClick={() => markAs('PERDIDO')}
              disabled={busy}
            >
              Marcar como perdido
            </button>
          </div>
          <button className="btn-primary" onClick={handleClose} disabled={busy}>
            Encerrar incidente
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-6">
          <div className="card w-full max-w-sm p-6">
            <div className="flex items-start justify-between">
              <p className="font-display text-base font-semibold text-white">
                Você acredita que seu dispositivo foi perdido ou roubado?
              </p>
              <button onClick={() => setShowConfirm(false)} className="text-mist">
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                className="btn-ghost flex-1"
                onClick={() => setShowConfirm(false)}
                disabled={busy}
              >
                CANCELAR
              </button>
              <button className="btn-danger flex-1" onClick={activate} disabled={busy}>
                {busy ? 'Ativando...' : 'ATIVAR'}
              </button>
            </div>
          </div>
        </div>
      )}

      {reportText && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-6">
          <div className="card flex max-h-[80vh] w-full max-w-sm flex-col p-6">
            <div className="flex items-start justify-between">
              <p className="font-display text-base font-semibold text-white">
                Relatório do incidente
              </p>
              <button onClick={() => setReportText(null)} className="text-mist">
                <X size={18} />
              </button>
            </div>
            <pre className="mt-4 flex-1 overflow-y-auto whitespace-pre-wrap rounded-lg bg-void-soft p-3 text-xs text-mist">
              {reportText}
            </pre>
            <div className="mt-4 flex gap-3">
              <button className="btn-ghost flex-1" onClick={copyReport}>
                Copiar texto
              </button>
              <button className="btn-primary flex-1" onClick={() => setReportText(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionRow({
  label,
  limited,
  onClick,
  disabled,
}: {
  label: string
  limited?: boolean
  onClick?: () => void
  disabled?: boolean
}) {
  const content = (
    <>
      <p className="text-sm text-white">{label}</p>
      {limited && (
        <p className="mt-1 text-[11px] text-mist">
          Depende das funcionalidades de segurança do sistema operacional.
        </p>
      )}
    </>
  )

  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="rounded-xl border border-white/5 bg-void-soft p-4 text-left disabled:opacity-50"
      >
        {content}
      </button>
    )
  }

  return <div className="rounded-xl border border-white/5 bg-void-soft p-4">{content}</div>
}
