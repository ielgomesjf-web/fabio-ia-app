import {
  MapPin, Star, Eye, Search, Phone, MousePointer, MessageSquare,
  Navigation, TrendingUp, CheckCircle2, Clock, Reply
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line
} from 'recharts';
import {
  gmnProfile, gmnMetrics, gmnSearchQueries, gmnReviews, gmnViewsHistory
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

export default function GMNPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Google Meu Negocio</h1>
          <p className="text-sm text-text-secondary mt-1">
            {gmnProfile.businessName} - {gmnProfile.category}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < Math.floor(gmnProfile.rating) ? 'text-warning fill-warning' : 'text-surface-lighter'} />
            ))}
          </div>
          <span className="text-sm font-bold text-warning">{gmnProfile.rating}</span>
          <span className="text-xs text-text-secondary">({gmnProfile.totalReviews} avaliacoes)</span>
          {gmnProfile.verified && (
            <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 size={10} /> Verificado
            </span>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { title: 'Visualizacoes do Perfil', value: fmt(gmnMetrics.profileViews), change: gmnMetrics.profileViewsChange, icon: Eye, color: 'primary' },
          { title: 'Aparicoes na Busca', value: fmt(gmnMetrics.searchAppearances), change: gmnMetrics.searchAppearancesChange, icon: Search, color: 'accent' },
          { title: 'Cliques no Site', value: fmt(gmnMetrics.websiteClicks), change: gmnMetrics.websiteClicksChange, icon: MousePointer, color: 'success' },
          { title: 'Cliques p/ Ligar', value: fmt(gmnMetrics.phoneCallClicks), change: gmnMetrics.phoneCallClicksChange, icon: Phone, color: 'warning' },
          { title: 'Pedidos de Rota', value: fmt(gmnMetrics.directionRequests), change: gmnMetrics.directionRequestsChange, icon: Navigation, color: 'info' },
          { title: 'Mensagens', value: fmt(gmnMetrics.messagesSent), change: gmnMetrics.messagesSentChange, icon: MessageSquare, color: 'instagram' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-surface border border-surface-lighter/40 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-${item.color}/15`}>
                  <Icon size={16} className={`text-${item.color}`} />
                </div>
                <span className="text-xs text-success font-medium">+{item.change}%</span>
              </div>
              <p className="text-xl font-bold text-text-primary">{item.value}</p>
              <p className="text-xs text-text-secondary mt-0.5">{item.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Views History */}
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-accent" /> Evolucao Semanal
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={gmnViewsHistory}>
              <defs>
                <linearGradient id="gradGmnViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradGmnSearches" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a42" />
              <XAxis dataKey="week" tick={{ fill: '#7b8ba8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#7b8ba8', fontSize: 12 }} tickFormatter={fmt} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="views" name="Visualizacoes" stroke="#7c5cfc" fill="url(#gradGmnViews)" />
              <Area type="monotone" dataKey="searches" name="Buscas" stroke="#00d4ff" fill="url(#gradGmnSearches)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Search Queries */}
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Search size={16} className="text-primary" /> Termos de Busca
          </h3>
          <div className="space-y-3">
            {gmnSearchQueries.map((q, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-text-secondary w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">{q.query}</p>
                  <div className="w-full bg-surface-lighter rounded-full h-1.5 mt-1">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full"
                      style={{ width: `${(q.impressions / gmnSearchQueries[0].impressions) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-medium text-text-primary">{fmt(q.impressions)}</p>
                  <p className="text-[10px] text-success">{fmt(q.clicks)} cliques</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Star size={16} className="text-warning" /> Avaliacoes Recentes
          </h3>
          <span className="text-xs text-text-secondary">
            {gmnReviews.filter(r => !r.replied).length} sem resposta
          </span>
        </div>
        <div className="space-y-3">
          {gmnReviews.map((review) => (
            <div key={review.id} className="p-3 bg-surface-light/60 rounded-xl border border-surface-lighter/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{review.author}</p>
                    <p className="text-[10px] text-text-secondary">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className={i < review.rating ? 'text-warning fill-warning' : 'text-surface-lighter'} />
                    ))}
                  </div>
                  {review.replied ? (
                    <span className="text-[10px] bg-success/20 text-success px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Reply size={8} /> Respondido
                    </span>
                  ) : (
                    <span className="text-[10px] bg-warning/20 text-warning px-1.5 py-0.5 rounded-full">
                      Pendente
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-text-secondary">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Business Info */}
      <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <MapPin size={16} className="text-primary" /> Informacoes do Negocio
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Endereco', value: gmnProfile.address },
            { label: 'Telefone', value: gmnProfile.phone },
            { label: 'Categoria', value: gmnProfile.category },
            { label: 'Website', value: gmnProfile.website },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-surface-light/60 rounded-xl">
              <p className="text-[10px] text-text-secondary">{item.label}</p>
              <p className="text-sm text-text-primary mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
