import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Radar, ClipboardList } from 'lucide-react'

const STEPS = [
  {
    icon: ShieldCheck,
    title: 'Proteja seu smartphone.',
    body: 'Ative o FÔNIX e comece a registrar os eventos de segurança do seu aparelho.',
  },
  {
    icon: Radar,
    title: 'Entenda o que aconteceu.',
    body: 'Uma linha do tempo organiza cada acontecimento — do normal ao crítico.',
  },
  {
    icon: ClipboardList,
    title: 'Tenha informações para agir.',
    body: 'Última localização disponível, relatórios e um contato de recuperação, tudo em um só lugar.',
  },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const isLast = step === STEPS.length - 1
  const Icon = STEPS[step].icon

  return (
    <div className="flex min-h-screen flex-col bg-void bg-phoenix-radial px-6 py-10">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="card flex h-24 w-24 items-center justify-center">
          <Icon size={40} className="text-electric" />
        </div>
        <h2 className="mt-8 font-display text-2xl font-semibold text-white">
          {STEPS[step].title}
        </h2>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist">{STEPS[step].body}</p>
      </div>

      <div className="flex items-center justify-center gap-2 pb-8">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? 'w-6 bg-electric' : 'w-1.5 bg-white/15'
            }`}
          />
        ))}
      </div>

      <button
        className="btn-primary w-full"
        onClick={() => (isLast ? navigate('/cadastro') : setStep((s) => s + 1))}
      >
        {isLast ? 'COMEÇAR' : 'PRÓXIMO'}
      </button>

      {!isLast && (
        <button
          className="mt-3 text-center text-xs text-mist hover:text-white"
          onClick={() => navigate('/cadastro')}
        >
          Pular
        </button>
      )}
    </div>
  )
}
