interface LogoProps {
  size?: number
  showWordmark?: boolean
}

// Marca própria: escudo (proteção) + silhueta de fênix em forma de pino de
// localização (recuperação/tecnologia). SVG original, sem referência a
// logos existentes.
export default function Logo({ size = 40, showWordmark = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#2D6CFF" />
          </linearGradient>
        </defs>
        <path
          d="M32 4 L56 12 V30 C56 46 46 56 32 60 C18 56 8 46 8 30 V12 Z"
          fill="#0E1A32"
          stroke="url(#logo-g)"
          strokeWidth="2"
        />
        <path
          d="M32 20 C25 22 22 34 32 44 C42 34 39 22 32 20 Z"
          fill="url(#logo-g)"
        />
        <circle cx="32" cy="30" r="4" fill="#050B18" />
      </svg>
      {showWordmark && (
        <span className="font-display text-xl font-semibold tracking-wide text-white">
          FÔNIX
        </span>
      )}
    </div>
  )
}
