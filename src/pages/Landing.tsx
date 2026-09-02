import { Link } from 'react-router-dom'

const beneficios = [
  { titulo: 'Modo Fênix', desc: 'Marque seu dispositivo como perdido ou roubado em segundos' },
  { titulo: 'Localização em tempo real', desc: 'Veja no mapa onde seu aparelho está' },
  { titulo: 'Histórico de eventos', desc: 'Linha do tempo completa de tudo que aconteceu' },
  { titulo: 'Relatório para a polícia', desc: 'Gere um relatório de incidente pronto para registrar B.O.' },
  { titulo: 'Contato de recuperação', desc: 'Alguém encontrou seu aparelho? Ele sabe como te devolver' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 pt-20 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
          Se seu celular sumir, o FÔNIX te ajuda a recuperar
        </h1>
        <p className="text-gray-600 mt-4 max-w-xl text-lg">
          Proteção completa contra perda e roubo. Localização, histórico e
          relatório de incidente, tudo em um só app.
        </p>
        <Link
          to="/planos"
          className="mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition"
        >
          Ver planos
        </Link>
        <p className="text-sm text-gray-400 mt-3">5 dias grátis para testar</p>
      </section>

      {/* Benefícios */}
      <section className="max-w-4xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-6">
        {beneficios.map((b) => (
          <div key={b.titulo} className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-1">{b.titulo}</h3>
            <p className="text-gray-600 text-sm">{b.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA final */}
      <section className="text-center py-16 px-4">
        <h2 className="text-2xl font-bold mb-4">Pronto para proteger seu smartphone?</h2>
        <Link
          to="/planos"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition"
        >
          Começar teste grátis
        </Link>
      </section>

      <footer className="text-center text-sm text-gray-400 py-6 border-t">
        <Link to="/login" className="underline">Já tenho conta — Entrar</Link>
      </footer>
    </div>
  )
}