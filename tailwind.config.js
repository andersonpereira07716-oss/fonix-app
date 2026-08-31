/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Identidade visual FÔNIX — cybersecurity premium
        void: {
          DEFAULT: '#050B18', // azul-marinho quase preto (fundo base)
          soft: '#0A1428',
          card: '#0E1A32',
        },
        electric: {
          DEFAULT: '#2D6CFF', // azul elétrico
          dim: '#1E4FCC',
        },
        cyan: {
          DEFAULT: '#22D3EE', // ciano — destaque de dados/tecnologia
        },
        alert: {
          DEFAULT: '#FF3B4E', // vermelho — emergência / incidente
        },
        safe: {
          DEFAULT: '#22C55E', // verde — segurança / normal
        },
        warn: {
          DEFAULT: '#F5B942', // âmbar — atenção
        },
        mist: {
          DEFAULT: '#9BB0D3', // texto secundário sobre fundo escuro
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(45, 108, 255, 0.45)',
        'glow-alert': '0 0 40px -8px rgba(255, 59, 78, 0.45)',
        card: '0 8px 30px -12px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'phoenix-radial':
          'radial-gradient(ellipse at top, rgba(45,108,255,0.16), transparent 60%)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
