import { MapPin } from 'lucide-react'

export default function MapaPage() {
  // A FASE 4 integra um provedor de mapas real e a Geolocation API.
  // Enquanto não houver localização real disponível, nunca inventamos coordenadas.
  const hasLocation = false

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <p className="label-eyebrow">Localização</p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-white">Mapa de segurança</h1>

      <div className="card mt-6 flex h-80 flex-col items-center justify-center gap-3 text-center">
        <MapPin className="text-mist" size={28} />
        {hasLocation ? (
          <p className="text-sm text-white">Última localização conhecida</p>
        ) : (
          <p className="max-w-xs text-sm text-mist">
            Não temos uma localização disponível neste momento.
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-mist">
        A FASE 4 conecta esta tela a um provedor de mapas e à localização real do dispositivo,
        somente quando permitida pelo usuário.
      </p>
    </div>
  )
}
