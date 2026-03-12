import { useState } from 'react';
import {
  Heart, MessageCircle, Bookmark, Share2, Eye, TrendingUp,
  ArrowUpDown, Filter, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line
} from 'recharts';
import {
  instagramProfile, instagramPosts, instagramThemePerformance,
  instagramFormatPerformance, instagramBestTimes
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

export default function InstagramAnalysis() {
  const [sortBy, setSortBy] = useState('engagement');
  const [filterTheme, setFilterTheme] = useState('Todos');

  const themes = ['Todos', ...new Set(instagramPosts.map(p => p.theme))];

  const sorted = [...instagramPosts]
    .filter(p => filterTheme === 'Todos' || p.theme === filterTheme)
    .sort((a, b) => {
      if (sortBy === 'engagement') return (b.likes + b.comments + b.saves + b.shares) - (a.likes + a.comments + a.saves + a.shares);
      if (sortBy === 'saves') return b.saves - a.saves;
      if (sortBy === 'reach') return b.reach - a.reach;
      return b.likes - a.likes;
    });

  const radarData = instagramThemePerformance.map(t => ({
    theme: t.theme,
    engajamento: t.avgEngagement,
    salvamentos: (t.avgSaves / 20),
    alcance: (t.avgReach / 10000),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analise Instagram</h1>
          <p className="text-sm text-text-secondary mt-1">
            {instagramProfile.username} - Ultimos 60 posts
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-secondary">{fmt(instagramProfile.followers)} seguidores</span>
          <span className="text-primary font-semibold">{instagramProfile.avgEngagement}% eng.</span>
        </div>
      </div>

      {/* Format Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {instagramFormatPerformance.map((f) => (
          <div key={f.format} className="bg-surface border border-surface-lighter rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                f.format === 'Reel' ? 'bg-instagram/20 text-instagram' :
                f.format === 'Carrossel' ? 'bg-primary/20 text-primary' :
                'bg-warning/20 text-warning'
              }`}>{f.format}</span>
              <span className="text-xs text-text-secondary">{f.count} posts</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-text-primary">{fmt(f.avgLikes)}</p>
                <p className="text-[10px] text-text-secondary">Likes/post</p>
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">{fmt(f.avgReach)}</p>
                <p className="text-[10px] text-text-secondary">Alcance</p>
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">{fmt(f.avgSaves)}</p>
                <p className="text-[10px] text-text-secondary">Salvamentos</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Theme Performance Radar */}
        <div className="bg-surface border border-surface-lighter rounded-xl p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Performance por Tema</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#363650" />
              <PolarAngleAxis dataKey="theme" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Radar name="Engajamento" dataKey="engajamento" stroke="#e1306c" fill="#e1306c" fillOpacity={0.3} />
              <Radar name="Salvamentos" dataKey="salvamentos" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Best Times */}
        <div className="bg-surface border border-surface-lighter rounded-xl p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Clock size={16} className="text-primary" /> Melhores Horarios
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={instagramBestTimes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#363650" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="engagement" name="Engajamento %" fill="#e1306c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-3">
            {instagramBestTimes.map(t => (
              <span key={t.day} className="text-xs bg-surface-light px-2 py-1 rounded">
                {t.day} {t.hour} ({t.engagement}%)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Save Rate by Theme */}
      <div className="bg-surface border border-surface-lighter rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Bookmark size={16} className="text-warning" /> Taxa de Salvamento por Tema
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={instagramThemePerformance} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#363650" />
            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis type="category" dataKey="theme" tick={{ fill: '#94a3b8', fontSize: 12 }} width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgSaves" name="Salvamentos/post" fill="#f59e0b" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Posts Ranking */}
      <div className="bg-surface border border-surface-lighter rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" /> Ranking de Posts
          </h3>
          <div className="flex gap-2">
            <select
              value={filterTheme}
              onChange={(e) => setFilterTheme(e.target.value)}
              className="text-xs bg-surface-light border border-surface-lighter rounded-lg px-3 py-1.5 text-text-primary"
            >
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-surface-light border border-surface-lighter rounded-lg px-3 py-1.5 text-text-primary"
            >
              <option value="engagement">Engajamento</option>
              <option value="saves">Salvamentos</option>
              <option value="reach">Alcance</option>
              <option value="likes">Likes</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-text-secondary border-b border-surface-lighter">
                <th className="text-left py-2 px-3">#</th>
                <th className="text-left py-2 px-3">Post</th>
                <th className="text-left py-2 px-3">Tipo</th>
                <th className="text-left py-2 px-3">Tema</th>
                <th className="text-right py-2 px-3"><Heart size={12} className="inline" /></th>
                <th className="text-right py-2 px-3"><MessageCircle size={12} className="inline" /></th>
                <th className="text-right py-2 px-3"><Bookmark size={12} className="inline" /></th>
                <th className="text-right py-2 px-3"><Share2 size={12} className="inline" /></th>
                <th className="text-right py-2 px-3"><Eye size={12} className="inline" /></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((post, i) => (
                <tr key={post.id} className="border-b border-surface-lighter/50 hover:bg-surface-light transition-colors">
                  <td className="py-2.5 px-3 text-text-secondary">{i + 1}</td>
                  <td className="py-2.5 px-3 text-text-primary font-medium max-w-[200px] truncate">{post.title}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      post.type === 'Reel' ? 'bg-instagram/20 text-instagram' :
                      post.type === 'Carrossel' ? 'bg-primary/20 text-primary' :
                      'bg-warning/20 text-warning'
                    }`}>{post.type}</span>
                  </td>
                  <td className="py-2.5 px-3 text-text-secondary text-xs">{post.theme}</td>
                  <td className="py-2.5 px-3 text-right text-text-primary">{fmt(post.likes)}</td>
                  <td className="py-2.5 px-3 text-right text-text-primary">{fmt(post.comments)}</td>
                  <td className="py-2.5 px-3 text-right text-warning font-medium">{fmt(post.saves)}</td>
                  <td className="py-2.5 px-3 text-right text-text-primary">{fmt(post.shares)}</td>
                  <td className="py-2.5 px-3 text-right text-text-primary">{fmt(post.reach)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gaps de Conteudo */}
      <div className="bg-surface border border-surface-lighter rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Gaps de Conteudo Identificados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { gap: 'Tutoriais passo-a-passo de IA', demand: 'Alta', reason: 'Tema IA tem maior engajamento mas poucos tutoriais detalhados' },
            { gap: 'Comparativos de ferramentas', demand: 'Media', reason: 'Audiencia engaja com IA mas nao ha comparativos diretos' },
            { gap: 'Bastidores / Day in my life', demand: 'Alta', reason: 'Conteudo humanizado tem alta taxa de salvamento' },
            { gap: 'Casos de sucesso de seguidores', demand: 'Media', reason: 'Prova social gera compartilhamentos' },
            { gap: 'Conteudo sobre Shorts/Reels tips', demand: 'Alta', reason: 'Meta-conteudo sobre criacao performa bem no nicho' },
            { gap: 'Series tematicas (Parte 1, 2, 3)', demand: 'Media', reason: 'Series aumentam retencao e seguidores' },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-surface-light rounded-lg border border-surface-lighter">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.demand === 'Alta' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                }`}>Demanda {item.demand}</span>
              </div>
              <p className="text-sm font-medium text-text-primary">{item.gap}</p>
              <p className="text-xs text-text-secondary mt-1">{item.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
