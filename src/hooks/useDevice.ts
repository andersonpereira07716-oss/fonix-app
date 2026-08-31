import { useEffect, useState } from 'react'
import { listMyDevices, createDevice } from '@/services/devices'
import type { Device } from '@/types'

/**
 * Retorna o dispositivo principal do usuário logado.
 * Se o usuário ainda não tiver nenhum dispositivo cadastrado,
 * cria um automaticamente (comportamento provisório até existir
 * uma tela dedicada de cadastro de dispositivo).
 */
export function useDevice() {
  const [device, setDevice] = useState<Device | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const devices = await listMyDevices()
        if (cancelled) return

        if (devices.length > 0) {
          setDevice(devices[0])
        } else {
          const created = await createDevice({
            name: 'Meu dispositivo',
            os: 'Android',
          })
          if (!cancelled) setDevice(created)
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar dispositivo.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { device, loading, error }
}
