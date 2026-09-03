import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const EmergencyPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleTriggerEmergency = async () => {
    setLoading(true);
    setStatus(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setStatus('Erro: Usuário não autenticado.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.rpc('trigger_emergency');

    if (error) {
      setStatus('Erro ao ativar modo de emergência: ' + error.message);
    } else {
      setStatus('🚨 MODO DE EMERGÊNCIA ATIVADO! Capturando localização do dispositivo...');
    }

    setLoading(false);
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#1a0000',
      border: '2px solid #ff4d4d',
      borderRadius: '12px',
      maxWidth: '450px',
      margin: '20px auto',
      color: '#fff',
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ color: '#ff4d4d', marginTop: 0 }}>Rastreio Remoto de Emergência</h2>
      <p style={{ color: '#ccc', fontSize: '0.95rem' }}>
        Perdeu ou teve o celular roubado? Ative o alerta remoto para forçar a coleta de localização e abrir um incidente automaticamente.
      </p>

      <button
        onClick={handleTriggerEmergency}
        disabled={loading}
        style={{
          backgroundColor: '#ff4d4d',
          color: '#fff',
          border: 'none',
          padding: '14px 24px',
          fontSize: '1rem',
          fontWeight: 'bold',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
          marginTop: '10px'
        }}
      >
        {loading ? 'Ativando Alerta...' : '🚨 ATIVAR MODO ROUBO / EMERGÊNCIA'}
      </button>

      {status && (
        <p style={{
          marginTop: '15px',
          fontSize: '0.9rem',
          color: status.startsWith('Erro') ? '#ff8080' : '#80ff80',
        }}>
          {status}
        </p>
      )}
    </div>
  );
};
