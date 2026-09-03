import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Geolocation } from '@capacitor/geolocation';

export function useEmergencyListener() {
  useEffect(() => {
    let channel: any;

    async function requestGpsPermissions() {
      try {
        const status = await Geolocation.checkPermissions();
        if (status.location !== 'granted') {
          await Geolocation.requestPermissions();
        }
      } catch (err) {
        console.warn('Erro ao solicitar permissões de GPS:', err);
      }
    }

    async function setupListener() {
      await requestGpsPermissions();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel(`public:profiles:id=eq.${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          async (payload) => {
            if (payload.new.emergency_triggered === true) {
              console.log('🚨 Sinal de emergência recebido via Web!');
              await processEmergencyTrigger(user.id);
            }
          }
        )
        .subscribe();
    }

    setupListener();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);
}

async function processEmergencyTrigger(userId: string) {
  try {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    });

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('id')
      .eq('owner_id', userId)
      .limit(1)
      .maybeSingle();

    if (deviceError || !device) {
      console.error('Nenhum dispositivo cadastrado para registrar a localização de emergência.');
      await supabase.rpc('clear_emergency_trigger');
      return;
    }

    await supabase.from('locations').insert({
      device_id: device.id,
      latitude: lat,
      longitude: lng,
      accuracy_meters: position.coords.accuracy,
      captured_at: new Date().toISOString(),
    });

    await supabase.from('incidents').insert({
      device_id: device.id,
      status: 'PERDIDO',
      opened_at: new Date().toISOString(),
    });

    console.log(`[FÔNIX SEGURANÇA] Localização de emergência registrada: ${lat}, ${lng}`);
  } catch (err) {
    console.error('Erro ao capturar GPS no modo emergência:', err);
  } finally {
    await supabase.rpc('clear_emergency_trigger');
  }
}
