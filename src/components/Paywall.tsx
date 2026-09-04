import React from 'react';
import { supabase } from '../lib/supabaseClient';

interface PaywallProps {
  userEmail?: string;
}

export const Paywall: React.FC<PaywallProps> = ({ userEmail }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleBuy = () => {
    // Substitua pelo seu link direto do checkout (Cakto, Mercado Pago, etc)
    window.open('https://pay.cakto.com.br/fs5aue5_1078174', '_blank');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', color: '#ff4757', marginBottom: '10px' }}>Acesso Restrito</h1>
      <p style={{ fontSize: '1.1rem', color: '#ccc', maxWidth: '400px', marginBottom: '20px' }}>
        Sua assinatura do <strong>FÔNIX</strong> está inativa ou pendente de pagamento.
      </p>

      {userEmail && (
        <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '30px' }}>
          Conectado como: <strong>{userEmail}</strong>
        </p>
      )}

      <button
        onClick={handleBuy}
        style={{
          backgroundColor: '#2ed573',
          color: '#000',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          padding: '14px 28px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '15px',
          width: '100%',
          maxWidth: '300px'
        }}
      >
        Liberar Acesso Agora
      </button>

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: 'transparent',
          color: '#888',
          border: '1px solid #444',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '300px'
        }}
      >
        Sair / Trocar Conta
      </button>
    </div>
  );
};
