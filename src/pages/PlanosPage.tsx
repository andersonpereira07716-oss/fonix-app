import { Link } from 'react-router-dom'

const CAKTO_CHECKOUT_URL = 'https://pay.cakto.com.br/fs5aue5_1078174'

const beneficios = [
  'Modo Fênix (marcar dispositivo como perdido/roubado)',
  'Mapa e histórico de localização',
  'Linha do tempo de eventos de segurança',
  'Relatório de incidente para a polícia',
  'Contato de recuperação',
  'Notificações em tempo real',
]

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">
        Proteja seu smartphone com o FÔNIX
      </h1>
      <p className="text-gray-600 text-center mb-10">
        3 dias grátis para testar. Cancele quando quiser.
      </p>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 max-w-sm w-full p-8">
        <h2 className="text-xl font-semibold text-center">FÔNIX Premium</h2>
        <div className="text-center my-4">
          <span className="text-4xl font-bold">R$10</span>
          <span className="text-gray-500">/mês</span>
        </div>
        <p className="text-center text-sm text-green-600 font-medium mb-6">
          3 dias de teste grátis
        </p>

        <ul className="space-y-3 mb-8">
          {beneficios.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-green-500 mt-0.5">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <a
          href={CAKTO_CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
        >
          Começar teste grátis
        </a>

        <p className="text-xs text-gray-400 text-center mt-4">
          Após os 3 dias, cobrança automática de R$10/mês. Cancele quando quiser.
        </p>
      </div>

      <Link to="/" className="text-sm text-gray-500 mt-8 underline">
        Voltar para a página inicial
      </Link>
    </div>
  )
}