import { useEffect, useState, useCallback } from 'react'
import { MapPin, RefreshCw } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useDevice } from '@/hooks/useDevice'
import { getLatestLocation, listLocationHistory, captureBrowserLocation } from '@/services/locations'
import type { DeviceLocation } from '@/types'

export default function MapaPage() {
  const { device, loading: loadingDevice } = useDevice()
  const [latest, setLatest] = useState<DeviceLocation | null>(null)
  const [history, setHistory] = useState<DeviceLocation[]>([])
  const [capturing, setCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(true)

  const loadLocations = useCallback(async () => {
    if (!device) return
    setLoadingLocation(true)
    try {
      const [latestLoc, hist] = await Promise.all([
        getLatestLocation(device.id),
        listLocationHistory(device.id, 20),
      ])
      setLatest(latestLoc)
      setHistory(hist)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar a localização.')
    } finally {
      setLoadingLocation(false)
    }
  }, [device])

  useEffect(() => {
    loadLocations()
  }, [loadLocations])

  async function handleCapture() {
    if (!device) return
    setCapturing(true)
    setError(null)
    try {
      await captureBrowserLocation(device.id)
      await loadLocations()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível obter a localização.')
    } finally {
      setCapturing(false)
    }
  }

  const hasLocation = Boolean(latest?.latitude && latest?.longitude)
  const trail = history
    .filter((h) => h.latitude != null && h.longitude != null)
    .map((h) => [h.latitude as number, h.longitude as number] as [number, number])
    .reverse()

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <p className="label-eyebrow">Localização</p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-white">Mapa de segurança</h1>

      <button
        className="btn-primary mt-6 flex w-full items-center justify-center gap-2"
        onClick={handleCapture}
        disabled={capturing || loadingDevice}
      >
        <RefreshCw size={16} className={capturing ? 'animate-spin' : ''} />
        {capturing ? 'Obtendo localização...' : 'Atualizar localização agora'}
      </button>

      {error && (
        <p className="mt-3 rounded-xl border border-alert/20 bg-alert/10 px-4 py-3 text-sm text-alert">
          {error}
        </p>
      )}

      {loadingLocation || loadingDevice ? (
        <div className="card mt-4 flex h-80 flex-col items-center justify-center gap-3 text-center">
          <MapPin className="text-mist" size={28} />
          <p className="text-sm text-mist">Carregando...</p>
        </div>
      ) : hasLocation && latest ? (
        <div className="card mt-4 overflow-hidden" style={{ height: 320 }}>
          <MapContainer
            center={[latest.latitude as number, latest.longitude as number]}
            zoom={16}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {trail.length > 1 && <Polyline positions={trail} color="#22d3ee" />}
            {history
              .filter((h) => h.latitude != null && h.longitude != null)
              .map((loc) => (
                <Marker key={loc.id} position={[loc.latitude as number, loc.longitude as number]}>
                  <Popup>
                    {loc.capturedAt ? new Date(loc.capturedAt).toLocaleString('pt-BR') : '—'}
                    {loc.accuracyMeters && (
                      <>
                        <br />
                        Precisão: ~{Math.round(loc.accuracyMeters)}m
                      </>
                    )}
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      ) : (
        <div className="card mt-4 flex h-80 flex-col items-center justify-center gap-3 text-center">
          <MapPin className="text-mist" size={28} />
          <p className="max-w-xs text-sm text-mist">
            Não temos uma localização disponível neste momento.
          </p>
        </div>
      )}

      {hasLocation && latest?.capturedAt && (
        <p className="mt-4 text-xs text-mist">
          Última localização conhecida: {new Date(latest.capturedAt).toLocaleString('pt-BR')}
        </p>
      )}
    </div>
  )
}
