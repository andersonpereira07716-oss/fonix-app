import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { Paywall } from './components/Paywall';
import { EmergencyPanel } from './components/EmergencyPanel';
import { NotificationBell } from './components/NotificationBell';
import { useEmergencyListener } from './hooks/useEmergencyListener';

export function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Ativa o escutador de emergência no app nativo
  useEmergencyListener();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkSubscription(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkSubscription(session.user.id);
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkSubscription(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', userId)
      .single();

    if (data && data.subscription_status === 'active') {
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0a0a0a', color: '#fff' }}>
        Carregando FÔNIX...
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#fff', backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
        <h2>FÔNIX - Autenticação</h2>
        <p>Acesse sua conta pelo formulário de Login do app.</p>
      </div>
    );
  }

  if (!isSubscribed) {
    return <Paywall userEmail={session.user.email} />;
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>FÔNIX - Segurança</h1>
        <NotificationBell />
      </header>
      
      <main>
        <EmergencyPanel />
      </main>
    </div>
  );
}

export default App;
