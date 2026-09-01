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
            if (payload.new.subscription_status === 'emergency_alert') {
              console.log('🚨 Sinal de emergência recebido via Web!');
              await processEmergencyTrigger(user.email);
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

  async function processEmergencyTrigger(userEmail?: string) {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

      console.log('Localização em segundo plano capturada:', mapUrl);

      await supabase.functions.invoke('activate_subscription', {
        body: { customer_email: userEmail }
      });

      alert(`[FÔNIX SEGURANÇA] Alerta remoto processado! Localização enviada: ${mapUrl}`);
    } catch (err) {
      console.error('Erro ao capturar GPS no modo emergência:', err);
    }
  }
}
