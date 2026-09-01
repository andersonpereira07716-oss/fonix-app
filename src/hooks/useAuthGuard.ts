import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAuthGuard() {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

      if (profile && profile.subscription_status === 'active') {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
      setLoading(false);
    }

    checkSubscription();
  }, []);

  return { loading, hasAccess };
}
