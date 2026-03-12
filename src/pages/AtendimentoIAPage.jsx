import {
  Phone, Bot, Users, TrendingUp, Clock, ThumbsUp, PhoneOff,
  ArrowRight, BarChart3, Zap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  atendimentoMetrics, atendimentoFunnel, atendimentoByHour, atendimentoBySource
} from '../data/mockData';

const fmt = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-light border border-surface-lighter rounded-lg p-3 shadow-xl">
      <p className="text-xs text-text-secondary mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function AtendimentoIAPage() {
  const m = atendimentoMetrics;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Atendimento IA</h1>
        <p className="text-sm text-text-secondary mt-1">
          Central de atendimento automatizado — {m.aiHandledPercent}% resolvido pela IA
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { title: 'Total Chamadas', value: fmt(m.totalCalls), change: m.totalCallsChange, icon: Phone, color: 'primary' },
          { title: 'Leads Convertidos', value: fmt(m.leadsConverted), sub: m.conversionRate + '% taxa', icon: Users, color: 'success' },
          { title: 'Atendidas pela IA', value: fmt(m.aiHandled), sub: m.aiHandledPercent + '%', icon: Bot, color: 'accent' },
          { title: 'Satisfacao', value: m.satisfaction + '/5', sub: 'Media geral', icon: ThumbsUp, color: 'warning' },
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

      {/* Additional Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-4 text-center">
          <Clock size={18} className="text-info mx-auto mb-2" />
          <p className="text-xl font-bold text-text-primary">{m.avgDuration}</p>
          <p className="text-xs text-text-secondary">Duracao Media</p>
        </div>
        <div className="bg-surface border border-danger/20 rounded-2xl p-4 text-center">
          <PhoneOff size={18} className="text-danger mx-auto mb-2" />
          <p className="text-xl font-bold text-text-primary">{m.abandonmentRate}%</p>
          <p className="text-xs text-text-secondary">Taxa de Abandono</p>
        </div>
        <div className="bg-surface border border-success/20 rounded-2xl p-4 text-center">
          <Zap size={18} className="text-success mx-auto mb-2" />
          <p className="text-xl font-bold text-text-primary">12s</p>
          <p className="text-xs text-text-secondary">Tempo de Resposta</p>
        </div>
      </div>

      {/* Funnel + By Hour */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funnel */}
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-accent" /> Funil de Atendimento
          </h3>
          <div className="space-y-3">
            {atendimentoFunnel.map((stage, i) => {
              const maxValue = atendimentoFunnel[0].value;
              const width = (stage.value / maxValue) * 100;
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-primary">{stage.stage}</span>
                    <span className="text-xs font-bold text-text-primary">{fmt(stage.value)}</span>
                  </div>
                  <div className="w-full bg-surface-lighter rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{ width: `${width}%`, backgroundColor: stage.color }}
                    />
                  </div>
                  {i < atendimentoFunnel.length - 1 && (
                    <div className="flex justify-center my-1">
                      <ArrowRight size={12} className="text-text-secondary rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* By Hour */}
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Clock size={16} className="text-primary" /> Volume por Horario
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={atendimentoByHour}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a42" />
              <XAxis dataKey="hour" tick={{ fill: '#7b8ba8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#7b8ba8', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="calls" name="Chamadas" fill="#7c5cfc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* By Source */}
      <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <BarChart3 size={16} className="text-success" /> Performance por Origem
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-text-secondary border-b border-surface-lighter">
                <th className="text-left py-2 px-3">Origem</th>
                <th className="text-right py-2 px-3">Chamadas</th>
                <th className="text-right py-2 px-3">Conversoes</th>
                <th className="text-right py-2 px-3">Taxa</th>
                <th className="text-left py-2 px-3">Performance</th>
              </tr>
            </thead>
            <tbody>
              {atendimentoBySource.map((s) => (
                <tr key={s.source} className="border-b border-surface-lighter/50 hover:bg-surface-light transition-colors">
                  <td className="py-2.5 px-3 font-medium text-text-primary">{s.source}</td>
                  <td className="py-2.5 px-3 text-right text-text-primary">{s.calls}</td>
                  <td className="py-2.5 px-3 text-right text-success font-medium">{s.conversions}</td>
                  <td className="py-2.5 px-3 text-right text-warning">{s.rate}%</td>
                  <td className="py-2.5 px-3">
                    <div className="w-full bg-surface-lighter rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${s.rate > 35 ? 'bg-success' : s.rate > 30 ? 'bg-warning' : 'bg-danger'}`}
                        style={{ width: `${(s.rate / 40) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-surface border border-accent/20 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Bot size={16} className="text-accent" /> Insights da IA
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { insight: 'Pico de chamadas entre 10h-11h', action: 'Reforcar equipe nesse horario' },
            { insight: 'Google Ads gera leads mais qualificados', action: 'Aumentar budget em 20%' },
            { insight: 'Taxa de abandono alta apos 17h', action: 'Estender horario do bot IA' },
            { insight: 'Leads de indicacao tem menor volume mas boa conversao', action: 'Criar programa de indicacao' },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-surface-light/60 rounded-xl border border-surface-lighter/30">
              <p className="text-sm text-text-primary">{item.insight}</p>
              <p className="text-xs text-accent mt-1 flex items-center gap-1">
                <Zap size={10} /> {item.action}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
