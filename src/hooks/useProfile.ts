import { useEffect, useState } from 'react'
import type { Profile } from '@/types'
import { getMyProfile } from '@/services/profiles'

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getMyProfile()
      .then((p) => {
        if (active) setProfile(p)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { profile, loading }
}
