import {
  Users, Eye, Clock, Heart, TrendingUp, Bookmark, BarChart3, Target
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import StatCard from '../components/StatCard';
import { dashboardMetrics, weeklyEngagement, contentIdeas, instagramThemePerformance } from '../data/mockData';

const fmt = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

// Paleta 2026: violeta, ciano, verde neon, coral, amber
const COLORS = ['#7c5cfc', '#00d4ff', '#34dd87', '#ff4a6e', '#ffad00'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-surface-lighter/60 rounded-xl p-3 shadow-2xl backdrop-blur-sm">
      <p className="text-xs text-text-secondary mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { youtube, instagram, audience } = dashboardMetrics;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Dashboard de Metricas</h1>
        <p className="text-sm text-text-secondary mt-1">
          Visao geral atualizada em tempo real &mdash; 12 Mar 2026
        </p>
      </div>

      {/* YouTube Stats */}
      <div>
        <h2 className="text-sm font-semibold text-youtube mb-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-youtube animate-pulse" /> YouTube
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard title="Inscritos" value={fmt(youtube.subscribers)} change={youtube.subscribersChange} icon={Users} color="youtube" />
          <StatCard title="Views (30 dias)" value={fmt(youtube.viewsLast30)} change={youtube.viewsChange} icon={Eye} color="youtube" />
          <StatCard title="Watch Time (h)" value={fmt(youtube.watchTimeHours)} icon={Clock} color="youtube" />
          <StatCard title="Retencao Media" value={youtube.avgRetention + '%'} icon={Target} color="youtube" />
        </div>
      </div>

      {/* Instagram Stats */}
      <div>
        <h2 className="text-sm font-semibold text-instagram mb-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-instagram animate-pulse" /> Instagram
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard title="Seguidores" value={fmt(instagram.followers)} change={instagram.followersChange} icon={Users} color="instagram" />
          <StatCard title="Alcance (30 dias)" value={fmt(instagram.reachLast30)} change={instagram.reachChange} icon={Eye} color="instagram" />
          <StatCard title="Taxa de Engajamento" value={instagram.engagementRate + '%'} icon={Heart} color="instagram" />
          <StatCard title="Salvamentos/Post" value={instagram.avgSaves} icon={Bookmark} color="instagram" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Engagement Chart */}
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-accent" /> Engajamento Semanal
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyEngagement} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a42" />
              <XAxis dataKey="day" tick={{ fill: '#7b8ba8', fontSize: 12 }} axisLine={{ stroke: '#1e2a42' }} />
              <YAxis tick={{ fill: '#7b8ba8', fontSize: 12 }} tickFormatter={fmt} axisLine={{ stroke: '#1e2a42' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="instagram" name="Instagram" fill="#f0427a" radius={[6, 6, 0, 0]} />
              <Bar dataKey="youtube" name="YouTube" fill="#ff3b3b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Theme Distribution */}
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-accent" /> Performance por Tema
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={instagramThemePerformance}
                dataKey="avgEngagement"
                nameKey="theme"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={45}
                strokeWidth={2}
                stroke="#080d19"
                label={({ theme, avgEngagement }) => `${theme} ${avgEngagement}%`}
              >
                {instagramThemePerformance.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Audience Info */}
      <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Dados da Audiencia</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Faixa Etaria Principal', value: audience.topAge },
            { label: 'Genero', value: audience.topGender },
            { label: 'Localizacao', value: audience.topLocation },
            { label: 'Horario de Pico', value: audience.peakHour },
          ].map((item) => (
            <div key={item.label} className="text-center p-4 bg-surface-light/60 rounded-xl border border-surface-lighter/30">
              <p className="text-lg font-bold text-accent">{item.value}</p>
              <p className="text-xs text-text-secondary mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Ideas Preview */}
      <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Top 5 Ideias de Conteudo</h3>
        <div className="space-y-2">
          {contentIdeas.slice(0, 5).map((idea) => (
            <div key={idea.id} className="flex items-center gap-3 p-3 bg-surface-light/40 rounded-xl hover:bg-surface-lighter/40 transition-all border border-transparent hover:border-primary/15">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                idea.potential >= 9 ? 'bg-success/15 text-success' :
                idea.potential >= 8 ? 'bg-warning/15 text-warning' :
                'bg-info/15 text-info'
              }`}>
                {idea.potential}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{idea.title}</p>
                <p className="text-xs text-text-secondary">{idea.format} &middot; {idea.theme}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium ${
                idea.urgency === 'Publicar hoje' ? 'bg-danger/15 text-danger' :
                idea.urgency === 'Esta semana' ? 'bg-warning/15 text-warning' :
                'bg-info/15 text-info'
              }`}>
                {idea.urgency}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
