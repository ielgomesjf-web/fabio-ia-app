import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Instagram, Youtube, Lightbulb, TrendingUp,
  Calendar, Zap, Link2, Bot, Menu, X, ChevronRight,
  MapPin, Megaphone, Phone, MessageCircle, FileText
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', desc: 'Metricas gerais', notifications: 0 },
  { path: '/gmn', icon: MapPin, label: 'Google Meu Negocio', desc: 'SEO local & avaliacoes', notifications: 3 },
  { path: '/instagram', icon: Instagram, label: 'Instagram', desc: 'Analise de perfil', notifications: 5 },
  { path: '/youtube', icon: Youtube, label: 'YouTube', desc: 'Analise de canal', notifications: 0 },
  { path: '/trafego', icon: Megaphone, label: 'Trafego Pago', desc: 'Google & Insta Ads', notifications: 2 },
  { path: '/atendimento', icon: Phone, label: 'Atendimento IA', desc: 'Central automatizada', notifications: 8 },
  { path: '/whatsapp', icon: MessageCircle, label: 'WhatsApp Bot', desc: 'Leads & agendamentos', notifications: 12 },
  { path: '/ideias', icon: Lightbulb, label: 'Ideias', desc: 'Gerador de conteudo', notifications: 0 },
  { path: '/viral', icon: TrendingUp, label: 'Viral', desc: 'Pesquisa viral', notifications: 0 },
  { path: '/calendario', icon: Calendar, label: 'Calendario', desc: 'Planejamento', notifications: 1 },
  { path: '/habilidades', icon: Zap, label: 'Habilidades', desc: 'Automacoes', notifications: 0 },
  { path: '/relatorios', icon: FileText, label: 'Relatorios', desc: 'PDFs & resumos', notifications: 4 },
  { path: '/conexoes', icon: Link2, label: 'Conexoes', desc: 'Apps externos', notifications: 0 },
];

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const [collapsed, setCollapsed] = useState(false);

  const totalNotifications = navItems.reduce((sum, item) => sum + item.notifications, 0);

  return (
    <>
      {/* Mobile toggle - hamburger button (visible when menu is closed) */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className={`fixed top-4 left-4 z-50 md:hidden bg-surface-light/80 backdrop-blur-md p-2.5 rounded-xl border border-surface-lighter/50 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}`}
      >
        <div className="relative">
          <Menu size={20} />
          {totalNotifications > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-danger rounded-full text-[8px] font-bold flex items-center justify-center text-white border-2 border-surface-light animate-pulse">
              {totalNotifications > 9 ? '9+' : totalNotifications}
            </span>
          )}
        </div>
      </button>

      {/* ========== DESKTOP SIDEBAR ========== */}
      <aside
        className={`
          hidden md:flex fixed top-0 left-0 h-full z-40 bg-surface/90 backdrop-blur-xl border-r border-surface-lighter/40
          transition-all duration-300 flex-col
          ${collapsed ? 'w-[72px]' : 'w-64'}
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

        {/* Desktop Nav */}
        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
                  <div className="relative flex-shrink-0">
                    <item.icon size={16} className={isActive ? 'drop-shadow-[0_0_6px_rgba(124,92,252,0.5)]' : ''} />
                    {item.notifications > 0 && (
                      <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-danger rounded-full border border-surface animate-pulse" />
                    )}
                  </div>
                  {!collapsed && (
                    <div className="overflow-hidden flex-1">
                      <p className="text-xs font-medium whitespace-nowrap">{item.label}</p>
                      <p className={`text-[10px] whitespace-nowrap ${isActive ? 'text-primary-light/60' : 'text-text-secondary'}`}>{item.desc}</p>
                    </div>
                  )}
                  {!collapsed && item.notifications > 0 && (
                    <span className="text-[10px] bg-danger/15 text-danger font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {item.notifications}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse button (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center p-3 border-t border-surface-lighter/40
                     text-text-secondary hover:text-accent transition-colors"
        >
          <ChevronRight
            size={18}
            className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
          />
        </button>
      </aside>

      {/* ========== MOBILE FULL-SCREEN MENU ========== */}
      <div
        className={`fixed inset-0 z-50 md:hidden bg-bg/98 backdrop-blur-xl flex flex-col transition-all duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-lighter/30">
          <img
            src="/logo-grz.svg"
            alt="GRZ"
            className="h-8 w-auto animate-logo-shimmer"
          />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2.5 rounded-xl bg-surface-light/50 text-text-secondary hover:text-text-primary hover:bg-surface-lighter/60 transition-all active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Nav List */}
        <nav className="flex-1 py-3 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200
                relative animate-fade-in
                ${isActive
                  ? 'bg-primary/10 text-primary-light border border-primary/20'
                  : 'text-text-secondary active:bg-surface-light/60 border border-transparent'
                }
              `}
              style={{ animationDelay: `${i * 25}ms` }}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-gradient-to-b from-primary to-accent rounded-r-full" />
                  )}
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-primary/20' : 'bg-surface-light/70'
                    }`}>
                      <item.icon size={20} className={isActive ? 'text-primary-light drop-shadow-[0_0_6px_rgba(124,92,252,0.5)]' : ''} />
                    </div>
                    {/* Red notification badge - upper left of the icon */}
                    {item.notifications > 0 && (
                      <span className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-danger rounded-full border-2 border-bg flex items-center justify-center animate-pulse">
                        <span className="w-1.5 h-1.5 bg-white rounded-full opacity-80" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${isActive ? 'text-primary-light' : 'text-text-primary'}`}>
                      {item.label}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-primary-light/50' : 'text-text-secondary'}`}>
                      {item.desc}
                    </p>
                  </div>
                  {item.notifications > 0 && (
                    <span className="text-[11px] bg-danger/15 text-danger font-bold px-2 py-1 rounded-full min-w-[26px] text-center">
                      {item.notifications}
                    </span>
                  )}
                  <ChevronRight size={16} className="text-text-secondary/30 flex-shrink-0" />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Footer */}
        <div className="px-5 py-4 border-t border-surface-lighter/30">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-text-secondary">GRZ - Gestao Risco Zero</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              <p className="text-[10px] text-success">Online</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
