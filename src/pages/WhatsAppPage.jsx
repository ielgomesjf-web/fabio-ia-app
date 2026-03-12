import { useState } from 'react';
import {
  MessageCircle, Users, Calendar, Clock, Send, CheckCircle2,
  AlertCircle, Phone, Bot, TrendingUp, BarChart3
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import {
  whatsappMetrics, whatsappConversations, whatsappByDay, whatsappTemplates
} from '../data/mockData';

const fmt = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

const statusColors = {
  active: 'bg-success/20 text-success',
  waiting: 'bg-warning/20 text-warning',
  resolved: 'bg-surface-lighter text-text-secondary',
};

const statusLabels = {
  active: 'Ativo',
  waiting: 'Aguardando',
  resolved: 'Resolvido',
};

export default function WhatsAppPage() {
  const [filter, setFilter] = useState('all');
  const m = whatsappMetrics;

  const filtered = filter === 'all'
    ? whatsappConversations
    : whatsappConversations.filter(c => c.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">WhatsApp Bot</h1>
          <p className="text-sm text-text-secondary mt-1">
            {m.activeNow} conversas ativas agora
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success font-medium">Bot Online</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { title: 'Conversas Totais', value: fmt(m.totalConversations), change: m.totalConversationsChange, icon: MessageCircle, color: 'success' },
          { title: 'Leads Capturados', value: fmt(m.leadsCapturados), change: m.leadsChange, icon: Users, color: 'primary' },
          { title: 'Agendamentos', value: fmt(m.agendamentos), change: m.agendamentosChange, icon: Calendar, color: 'accent' },
          { title: 'Satisfacao', value: m.satisfacao + '/5', sub: 'Tempo resp: ' + m.tempoResposta, icon: Bot, color: 'warning' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-surface border border-surface-lighter/40 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-${item.color}/15`}>
                  <Icon size={16} className={`text-${item.color}`} />
                </div>
                {item.change && <span className="text-xs text-success font-medium">+{item.change}%</span>}
              </div>
              <p className="text-xl font-bold text-text-primary">{item.value}</p>
              <p className="text-xs text-text-secondary mt-0.5">{item.sub || item.title}</p>
            </div>
          );
        })}
      </div>

      {/* Chart + Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart by Day */}
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-accent" /> Volume Semanal
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={whatsappByDay} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a42" />
              <XAxis dataKey="day" tick={{ fill: '#7b8ba8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#7b8ba8', fontSize: 12 }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-surface-light border border-surface-lighter rounded-lg p-3 shadow-xl">
                      <p className="text-xs text-text-secondary mb-1">{label}</p>
                      {payload.map((p, i) => (
                        <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
                          {p.name}: {p.value}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Bar dataKey="conversations" name="Conversas" fill="#34dd87" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leads" name="Leads" fill="#7c5cfc" radius={[4, 4, 0, 0]} />
              <Bar dataKey="agendamentos" name="Agendamentos" fill="#00d4ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Conversations */}
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <MessageCircle size={16} className="text-success" /> Conversas Recentes
            </h3>
            <div className="flex gap-1">
              {['all', 'active', 'waiting', 'resolved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[10px] px-2 py-1 rounded-full transition-colors ${
                    filter === f ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-surface-light'
                  }`}
                >
                  {f === 'all' ? 'Todos' : statusLabels[f]}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2 max-h-[320px] overflow-y-auto">
            {filtered.map((conv) => (
              <div key={conv.id} className="p-3 bg-surface-light/60 rounded-xl border border-surface-lighter/30 hover:border-primary/20 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center text-xs font-bold text-success">
                      {conv.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{conv.name}</p>
                      <p className="text-[10px] text-text-secondary">{conv.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusColors[conv.status]}`}>
                      {statusLabels[conv.status]}
                    </span>
                    <span className="text-[10px] text-text-secondary">{conv.time}</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary truncate pl-10">{conv.lastMessage}</p>
                <div className="flex items-center gap-2 mt-1.5 pl-10">
                  <span className="text-[10px] bg-surface-lighter px-1.5 py-0.5 rounded">{conv.source}</span>
                  {conv.qualified && (
                    <span className="text-[10px] bg-success/15 text-success px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <CheckCircle2 size={8} /> Qualificado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Templates */}
      <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Send size={16} className="text-primary" /> Templates de Mensagem
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {whatsappTemplates.map((t) => (
            <div key={t.id} className="p-3 bg-surface-light/60 rounded-xl border border-surface-lighter/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-text-primary">{t.name}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  t.type === 'Automatica' ? 'bg-accent/20 text-accent' : 'bg-warning/20 text-warning'
                }`}>{t.type}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm font-bold text-text-primary">{fmt(t.sent)}</p>
                  <p className="text-[10px] text-text-secondary">Enviadas</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{fmt(t.responded)}</p>
                  <p className="text-[10px] text-text-secondary">Respondidas</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-success">{t.rate}%</p>
                  <p className="text-[10px] text-text-secondary">Taxa</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
