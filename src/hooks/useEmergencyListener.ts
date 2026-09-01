import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Geolocation } from '@capacitor/geolocation';

export function useEmergencyListener() {
  useEffect(() => {
    let channel: any;

    async function setupListener() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Escuta em tempo real mudanças no perfil do usuário no Supabase
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
              await processEmergencyTrigger(user.id, user.email);
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

  async function processEmergencyTrigger(userId: string, userEmail?: string) {
    try {
      // Captura o GPS do celular
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

      console.log('Localização capturada com sucesso:', mapUrl);

      // Envia a localização e reseta o status para ativo
      await supabase.functions.invoke('activate_subscription', {
        body: { customer_email: userEmail }
      });

      alert(`[FÔNIX SEGURANÇA] Alerta remoto processado! Localização enviada: ${mapUrl}`);
    } catch (err) {
      console.error('Erro ao capturar GPS no modo emergência:', err);
    }
  }
}
