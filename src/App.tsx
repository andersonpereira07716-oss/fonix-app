import { Routes, Route, Navigate } from 'react-router-dom'
import Splash from '@/pages/Splash'
import Onboarding from '@/pages/Onboarding'
import Login from '@/pages/Login'
import Cadastro from '@/pages/Cadastro'
import AppLayout from '@/components/layout/AppLayout'
import RequireAuth from '@/components/layout/RequireAuth'
import Dashboard from '@/pages/Dashboard'
import MapaPage from '@/pages/MapaPage'
import EventosPage from '@/pages/EventosPage'
import FenixPage from '@/pages/FenixPage'
import ConfiguracoesPage from '@/pages/ConfiguracoesPage'
import PlanosPage from '@/pages/PlanosPage'
// ...
<Route path="/planos" element={<PlanosPage />} />
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Área autenticada — protegida por Supabase Auth (RequireAuth) */}
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="mapa" element={<MapaPage />} />
          <Route path="eventos" element={<EventosPage />} />
          <Route path="fenix" element={<FenixPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}