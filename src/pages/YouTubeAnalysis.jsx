import {
  Eye, ThumbsUp, MessageCircle, Clock, TrendingUp, Users, Play, Film
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { youtubeChannel, youtubeVideos, youtubeGrowth } from '../data/mockData';

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

export default function YouTubeAnalysis() {
  const longVideos = youtubeVideos.filter(v => v.type === 'Longo');
  const shorts = youtubeVideos.filter(v => v.type === 'Short');

  const avgLongViews = Math.round(longVideos.reduce((s, v) => s + v.views, 0) / longVideos.length);
  const avgShortViews = Math.round(shorts.reduce((s, v) => s + v.views, 0) / shorts.length);
  const avgLongRetention = Math.round(longVideos.reduce((s, v) => s + v.retention, 0) / longVideos.length);
  const avgShortRetention = Math.round(shorts.reduce((s, v) => s + v.retention, 0) / shorts.length);

  const comparisonData = [
    { metric: 'Views Medias', longo: avgLongViews, short: avgShortViews },
    { metric: 'Retencao %', longo: avgLongRetention, short: avgShortRetention },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analise YouTube</h1>
          <p className="text-sm text-text-secondary mt-1">
            {youtubeChannel.name} - Ultimos 6 meses
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-text-secondary">{fmt(youtubeChannel.subscribers)} inscritos</span>
          <span className="text-youtube font-semibold">{youtubeChannel.avgCTR}% CTR</span>
        </div>
      </div>

      {/* Channel Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface border border-youtube/20 rounded-xl p-4 text-center">
          <Users size={20} className="text-youtube mx-auto mb-2" />
          <p className="text-2xl font-bold text-text-primary">{fmt(youtubeChannel.subscribers)}</p>
          <p className="text-xs text-text-secondary">Inscritos</p>
        </div>
        <div className="bg-surface border border-youtube/20 rounded-xl p-4 text-center">
          <Eye size={20} className="text-youtube mx-auto mb-2" />
          <p className="text-2xl font-bold text-text-primary">{fmt(youtubeChannel.totalViews)}</p>
          <p className="text-xs text-text-secondary">Views Totais</p>
        </div>
        <div className="bg-surface border border-youtube/20 rounded-xl p-4 text-center">
          <Clock size={20} className="text-youtube mx-auto mb-2" />
          <p className="text-2xl font-bold text-text-primary">{youtubeChannel.avgWatchTime}</p>
          <p className="text-xs text-text-secondary">Watch Time Medio</p>
        </div>
        <div className="bg-surface border border-youtube/20 rounded-xl p-4 text-center">
          <TrendingUp size={20} className="text-youtube mx-auto mb-2" />
          <p className="text-2xl font-bold text-text-primary">{youtubeChannel.avgCTR}%</p>
          <p className="text-xs text-text-secondary">CTR Medio</p>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-surface border border-surface-lighter rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-success" /> Crescimento do Canal
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={youtubeGrowth}>
            <defs>
              <linearGradient id="gradSubs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff0000" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff0000" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#363650" />
            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={fmt} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={fmt} />
            <Tooltip content={<CustomTooltip />} />
            <Area yAxisId="left" type="monotone" dataKey="subscribers" name="Inscritos" stroke="#ff0000" fill="url(#gradSubs)" />
            <Area yAxisId="right" type="monotone" dataKey="views" name="Views" stroke="#6366f1" fill="url(#gradViews)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Videos Long vs Short comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-surface-lighter rounded-xl p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
            <Film size={16} className="text-youtube" /> Comparativo: Formato
          </h3>
          <p className="text-xs text-text-secondary mb-4">Views medias e retencao por formato</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-light rounded-lg">
              <div className="flex items-center gap-3">
                <Play size={16} className="text-youtube" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Videos Longos</p>
                  <p className="text-xs text-text-secondary">{longVideos.length} videos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-text-primary">{fmt(avgLongViews)} views</p>
                <p className="text-xs text-warning">{avgLongRetention}% retencao</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-light rounded-lg">
              <div className="flex items-center gap-3">
                <Film size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Shorts</p>
                  <p className="text-xs text-text-secondary">{shorts.length} videos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-text-primary">{fmt(avgShortViews)} views</p>
                <p className="text-xs text-success">{avgShortRetention}% retencao</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs text-primary font-medium">Insight:</p>
            <p className="text-xs text-text-secondary mt-1">
              Shorts tem {Math.round(avgShortViews / avgLongViews)}x mais views e {avgShortRetention - avgLongRetention}% mais retencao.
              Ideal para crescimento rapido de audiencia.
            </p>
          </div>
        </div>

        {/* Views Distribution */}
        <div className="bg-surface border border-surface-lighter rounded-xl p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Eye size={16} className="text-primary" /> Views por Video
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={youtubeVideos.sort((a, b) => b.views - a.views).slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#363650" />
              <XAxis dataKey="title" tick={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={fmt} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-surface-light border border-surface-lighter rounded-lg p-3 shadow-xl max-w-[200px]">
                      <p className="text-xs text-text-primary font-medium truncate">{d.title}</p>
                      <p className="text-xs text-text-secondary">{d.type}</p>
                      <p className="text-sm font-bold text-youtube mt-1">{fmt(d.views)} views</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="views" name="Views" fill="#ff0000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Videos Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Long Videos */}
        <div className="bg-surface border border-surface-lighter rounded-xl p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Play size={16} className="text-youtube" /> Top Videos Longos
          </h3>
          <div className="space-y-2">
            {longVideos.sort((a, b) => b.views - a.views).map((v, i) => (
              <div key={v.id} className="flex items-center gap-3 p-2.5 bg-surface-light rounded-lg">
                <span className="text-xs text-text-secondary w-5 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{v.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-text-secondary flex items-center gap-1">
                      <Eye size={10} /> {fmt(v.views)}
                    </span>
                    <span className="text-xs text-text-secondary flex items-center gap-1">
                      <Clock size={10} /> {v.watchTime}
                    </span>
                    <span className="text-xs text-warning">{v.ctr}% CTR</span>
                    <span className="text-xs text-success">{v.retention}% ret.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shorts */}
        <div className="bg-surface border border-surface-lighter rounded-xl p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Film size={16} className="text-primary" /> Top Shorts
          </h3>
          <div className="space-y-2">
            {shorts.sort((a, b) => b.views - a.views).map((v, i) => (
              <div key={v.id} className="flex items-center gap-3 p-2.5 bg-surface-light rounded-lg">
                <span className="text-xs text-text-secondary w-5 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{v.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-text-secondary flex items-center gap-1">
                      <Eye size={10} /> {fmt(v.views)}
                    </span>
                    <span className="text-xs text-text-secondary flex items-center gap-1">
                      <ThumbsUp size={10} /> {fmt(v.likes)}
                    </span>
                    <span className="text-xs text-success">{v.retention}% ret.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
