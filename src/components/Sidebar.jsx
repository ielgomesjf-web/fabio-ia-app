import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Instagram, Youtube, Lightbulb, TrendingUp,
  Calendar, Zap, Link2, Bot, Menu, X, ChevronRight,
  MapPin, Megaphone, Phone, MessageCircle, FileText
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', desc: 'Metricas gerais' },
  { path: '/gmn', icon: MapPin, label: 'Google Meu Negocio', desc: 'SEO local & avaliacoes' },
  { path: '/instagram', icon: Instagram, label: 'Instagram', desc: 'Analise de perfil' },
  { path: '/youtube', icon: Youtube, label: 'YouTube', desc: 'Analise de canal' },
  { path: '/trafego', icon: Megaphone, label: 'Trafego Pago', desc: 'Google & Insta Ads' },
  { path: '/atendimento', icon: Phone, label: 'Atendimento IA', desc: 'Central automatizada' },
  { path: '/whatsapp', icon: MessageCircle, label: 'WhatsApp Bot', desc: 'Leads & agendamentos' },
  { path: '/ideias', icon: Lightbulb, label: 'Ideias', desc: 'Gerador de conteudo' },
  { path: '/viral', icon: TrendingUp, label: 'Viral', desc: 'Pesquisa viral' },
  { path: '/calendario', icon: Calendar, label: 'Calendario', desc: 'Planejamento' },
  { path: '/habilidades', icon: Zap, label: 'Habilidades', desc: 'Automacoes' },
  { path: '/relatorios', icon: FileText, label: 'Relatorios', desc: 'PDFs & resumos' },
  { path: '/conexoes', icon: Link2, label: 'Conexoes', desc: 'Apps externos' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-surface-light/80 backdrop-blur-md p-2.5 rounded-xl border border-surface-lighter/50"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 bg-surface/90 backdrop-blur-xl border-r border-surface-lighter/40
          transition-all duration-300 flex flex-col
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-4 border-b border-surface-lighter/40">
          {collapsed ? (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 animate-glow-pulse">
              <Bot size={20} className="text-white" />
            </div>
          ) : (
            <img
              src="/logo-grz.svg"
              alt="GRZ - Gestao Risco Zero"
              className="h-9 w-auto animate-logo-shimmer animate-logo-float"
            />
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200
                group relative
                ${isActive
                  ? 'bg-primary/12 text-primary-light border border-primary/20'
                  : 'text-text-secondary hover:bg-surface-light/60 hover:text-text-primary border border-transparent'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-primary to-accent rounded-r-full" />
                  )}
                  <item.icon size={16} className={`flex-shrink-0 ${isActive ? 'drop-shadow-[0_0_6px_rgba(124,92,252,0.5)]' : ''}`} />
                  {!collapsed && (
                    <div className="overflow-hidden">
                      <p className="text-xs font-medium whitespace-nowrap">{item.label}</p>
                      <p className={`text-[10px] whitespace-nowrap ${isActive ? 'text-primary-light/60' : 'text-text-secondary'}`}>{item.desc}</p>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse button (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center p-3 border-t border-surface-lighter/40
                     text-text-secondary hover:text-accent transition-colors"
        >
          <ChevronRight
            size={18}
            className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
          />
        </button>
      </aside>
    </>
  );
}
