import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Tipos definidos localmente para evitar erro de importação
interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    async function loadNotifications() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setNotifications(data);
    }

    loadNotifications();
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '1.5rem',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#ff4d4d',
            color: '#fff',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '35px',
          width: '280px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          zIndex: 1000,
          padding: '10px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '0.9rem' }}>Notificações</h4>
          {notifications.length === 0 ? (
            <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>Nenhuma notificação.</p>
          ) : (
            notifications.map(n => (
              <div key={n.id} style={{
                padding: '8px',
                borderBottom: '1px solid #222',
                color: n.read ? '#888' : '#fff',
                fontSize: '0.85rem'
              }}>
                <strong>{n.title}</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem' }}>{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
