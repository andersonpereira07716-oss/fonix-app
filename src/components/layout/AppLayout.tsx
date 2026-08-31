import { NavLink, Outlet } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import { Home, MapPin, Clock, ShieldAlert, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/app/dashboard', label: 'Início', icon: Home },
  { to: '/app/mapa', label: 'Mapa', icon: MapPin },
  { to: '/app/eventos', label: 'Eventos', icon: Clock },
  { to: '/app/fenix', label: 'Fênix', icon: ShieldAlert },
  { to: '/app/configuracoes', label: 'Config.', icon: Settings },
]

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-void bg-phoenix-radial">
      <div className="mx-auto flex max-w-6xl">
        {/* Sidebar — desktop */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/5 px-5 py-6 md:flex">
          <Logo showWordmark size={32} />
          <nav className="mt-10 flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white/5 text-white'
                      : 'text-mist hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Conteúdo */}
        <main className="min-h-screen w-full pb-24 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Navegação inferior — mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/5 bg-void-soft/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] transition ${
                  isActive ? 'text-electric' : 'text-mist'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
