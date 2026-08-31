import { useState } from 'react'
import { ShieldAlert, X } from 'lucide-react'

type LocalStatus = 'NORMAL' | 'INCIDENTE_ATIVO'

export default function FenixPage() {
  const [status, setStatus] = useState<LocalStatus>('NORMAL')
  const [showConfirm, setShowConfirm] = useState(false)

  function activate() {
    // FASE 3: criar incidente real (tabela `incidents`) e registrar evento CRÍTICO
    setStatus('INCIDENTE_ATIVO')
    setShowConfirm(false)
  }

  function closeIncident() {
    setStatus('NORMAL')
  }

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <p className="label-eyebrow">Modo Fênix</p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-white">
        Central de recuperação
      </h1>

      {status === 'NORMAL' ? (
        <div className="card mt-6 flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-alert/10">
            <ShieldAlert className="text-alert" size={30} />
          </div>
          <p className="max-w-xs text-sm text-mist">
            Ative o Modo Fênix somente se acredita que seu dispositivo foi perdido ou roubado.
          </p>
          <button className="btn-danger w-full max-w-xs" onClick={() => setShowConfirm(true)}>
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
            <ActionRow label="📋 Gerar relatório" />
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost flex-1">Marcar como roubado</button>
            <button className="btn-ghost flex-1">Marcar como perdido</button>
          </div>
          <button className="btn-primary" onClick={closeIncident}>
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
              <button className="btn-ghost flex-1" onClick={() => setShowConfirm(false)}>
                CANCELAR
              </button>
              <button className="btn-danger flex-1" onClick={activate}>
                ATIVAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionRow({ label, limited }: { label: string; limited?: boolean }) {
  return (
    <div className="rounded-xl border border-white/5 bg-void-soft p-4">
      <p className="text-sm text-white">{label}</p>
      {limited && (
        <p className="mt-1 text-[11px] text-mist">
          Depende das funcionalidades de segurança do sistema operacional.
        </p>
      )}
    </div>
  )
}
