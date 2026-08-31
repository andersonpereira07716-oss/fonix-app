import { Link } from 'react-router-dom'
import { Smartphone, MapPin, BatteryMedium, Wifi, Clock3, ShieldCheck, Check, Circle } from 'lucide-react'
import { demoDevice } from '@/services/mockData'
import { useProfile } from '@/hooks/useProfile'

const CHECKLIST = [
  { label: 'Conta criada', done: true },
  { label: 'Dispositivo cadastrado', done: true },
  { label: 'Proteção ativada', done: true },
  { label: 'Contato de recuperação', done: false },
  { label: 'Configurações avançadas', done: false },
]

function timeAgo(iso: string | null) {
  if (!iso) return 'Sem registro'
  const diffMin = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (diffMin < 1) return 'agora mesmo'
  if (diffMin < 60) return `há ${diffMin} min`
  return `há ${Math.round(diffMin / 60)} h`
}

export default function Dashboard() {
  const { profile, loading } = useProfile()
  const progress = Math.round((CHECKLIST.filter((c) => c.done).length / CHECKLIST.length) * 100)

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <p className="label-eyebrow">Olá, {loading ? '...' : profile?.name ?? 'usuário'}</p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-white">Painel de proteção</h1>

      {/* Card principal de proteção */}
      <div className="card mt-6 flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-safe/10">
            <ShieldCheck className="text-safe" size={22} />
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-white">PROTEÇÃO ATIVA</p>
            <p className="text-xs text-mist">{demoDevice.name}</p>
          </div>
        </div>
        <span className="rounded-full bg-safe/10 px-3 py-1 font-mono text-[11px] text-safe">
          ONLINE
        </span>
      </div>

      {/* Informações do dispositivo */}
      <div className="card mt-4 grid grid-cols-2 gap-4 p-5 sm:grid-cols-5">
        <InfoTile icon={Smartphone} label="Dispositivo" value={demoDevice.name} />
        <InfoTile icon={MapPin} label="Última localização" value="Ver mapa" />
        <InfoTile
          icon={BatteryMedium}
          label="Bateria"
          value={demoDevice.batteryLevel ? `${demoDevice.batteryLevel}%` : '—'}
        />
        <InfoTile icon={Wifi} label="Conexão" value={demoDevice.connectionStatus} />
        <InfoTile icon={Clock3} label="Sincronização" value={timeAgo(demoDevice.lastSyncAt)} />
      </div>

      {/* Progresso da proteção */}
      <div className="card mt-4 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white">Proteção {progress}% configurada</p>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-electric to-cyan transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ul className="mt-4 flex flex-col gap-2.5">
          {CHECKLIST.map((item) => (
            <li key={item.label} className="flex items-center gap-2.5 text-sm">
              {item.done ? (
                <Check size={16} className="text-safe" />
              ) : (
                <Circle size={16} className="text-mist/50" />
              )}
              <span className={item.done ? 'text-white' : 'text-mist'}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Atalho para o Modo Fênix */}
      <Link
        to="/app/fenix"
        className="card mt-4 flex items-center justify-between border-alert/20 p-5 transition hover:border-alert/40"
      >
        <div>
          <p className="font-display text-sm font-semibold text-alert">MODO FÊNIX</p>
          <p className="mt-1 text-xs text-mist">Perdeu o aparelho? Ative aqui.</p>
        </div>
        <span className="text-alert">→</span>
      </Link>
    </div>
  )
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Smartphone
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Icon size={16} className="text-cyan" />
      <p className="label-eyebrow">{label}</p>
      <p className="truncate text-sm text-white">{value}</p>
    </div>
  )
}
