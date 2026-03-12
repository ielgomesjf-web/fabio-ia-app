import {
  MousePointer, DollarSign, Target, TrendingUp, Eye, BarChart3,
  Pause, Play, ArrowUpRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  googleAdsMetrics, instagramAdsMetrics, adsCampaigns, adsPerformanceHistory
} from '../data/mockData';

const fmt = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

const fmtBRL = (n) => 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-light border border-surface-lighter rounded-lg p-3 shadow-xl">
      <p className="text-xs text-text-secondary mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.value > 100 ? fmt(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const COLORS = ['#7c5cfc', '#00d4ff', '#34dd87', '#ff4a6e', '#ffad00'];

export default function TrafegoPagoPage() {
  const totalSpent = googleAdsMetrics.cost + instagramAdsMetrics.cost;
  const totalConversions = googleAdsMetrics.conversions + instagramAdsMetrics.leads;

  const platformData = [
    { name: 'Google Ads', value: googleAdsMetrics.cost },
    { name: 'Instagram Ads', value: instagramAdsMetrics.cost },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Trafego Pago</h1>
        <p className="text-sm text-text-secondary mt-1">
          Google Ads + Instagram Ads — Investimento total: {fmtBRL(totalSpent)}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-4">
          <DollarSign size={18} className="text-warning mb-2" />
          <p className="text-xl font-bold text-text-primary">{fmtBRL(totalSpent)}</p>
          <p className="text-xs text-text-secondary">Investimento Total</p>
        </div>
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-4">
          <Target size={18} className="text-success mb-2" />
          <p className="text-xl font-bold text-text-primary">{totalConversions}</p>
          <p className="text-xs text-text-secondary">Conversoes Totais</p>
        </div>
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-4">
          <MousePointer size={18} className="text-accent mb-2" />
          <p className="text-xl font-bold text-text-primary">{fmt(googleAdsMetrics.clicks + instagramAdsMetrics.clicks)}</p>
          <p className="text-xs text-text-secondary">Cliques Totais</p>
        </div>
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-4">
          <TrendingUp size={18} className="text-primary mb-2" />
          <p className="text-xl font-bold text-text-primary">{((googleAdsMetrics.roas + instagramAdsMetrics.roas) / 2).toFixed(1)}x</p>
          <p className="text-xs text-text-secondary">ROAS Medio</p>
        </div>
      </div>

      {/* Google Ads vs Instagram Ads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Google Ads */}
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" /> Google Ads
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Impressoes', value: fmt(googleAdsMetrics.impressions) },
              { label: 'Cliques', value: fmt(googleAdsMetrics.clicks) },
              { label: 'CTR', value: googleAdsMetrics.ctr + '%' },
              { label: 'CPC', value: fmtBRL(googleAdsMetrics.cpc) },
              { label: 'Conversoes', value: googleAdsMetrics.conversions },
              { label: 'Taxa Conv.', value: googleAdsMetrics.conversionRate + '%' },
              { label: 'CPA', value: fmtBRL(googleAdsMetrics.costPerConversion) },
              { label: 'ROAS', value: googleAdsMetrics.roas + 'x' },
            ].map((item) => (
              <div key={item.label} className="p-2.5 bg-surface-light/60 rounded-xl text-center">
                <p className="text-sm font-bold text-text-primary">{item.value}</p>
                <p className="text-[10px] text-text-secondary">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
            <p className="text-xs text-primary font-medium">Investimento: {fmtBRL(googleAdsMetrics.cost)}</p>
            <p className="text-[10px] text-text-secondary mt-0.5">Retorno estimado: {fmtBRL(googleAdsMetrics.cost * googleAdsMetrics.roas)}</p>
          </div>
        </div>

        {/* Instagram Ads */}
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-instagram" /> Instagram Ads
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Alcance', value: fmt(instagramAdsMetrics.reach) },
              { label: 'Cliques', value: fmt(instagramAdsMetrics.clicks) },
              { label: 'CTR', value: instagramAdsMetrics.ctr + '%' },
              { label: 'CPM', value: fmtBRL(instagramAdsMetrics.cpm) },
              { label: 'Leads', value: instagramAdsMetrics.leads },
              { label: 'Eng. Rate', value: instagramAdsMetrics.engagementRate + '%' },
              { label: 'CPL', value: fmtBRL(instagramAdsMetrics.costPerLead) },
              { label: 'ROAS', value: instagramAdsMetrics.roas + 'x' },
            ].map((item) => (
              <div key={item.label} className="p-2.5 bg-surface-light/60 rounded-xl text-center">
                <p className="text-sm font-bold text-text-primary">{item.value}</p>
                <p className="text-[10px] text-text-secondary">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="p-3 bg-instagram/10 rounded-xl border border-instagram/20">
            <p className="text-xs text-instagram font-medium">Investimento: {fmtBRL(instagramAdsMetrics.cost)}</p>
            <p className="text-[10px] text-text-secondary mt-0.5">Retorno estimado: {fmtBRL(instagramAdsMetrics.cost * instagramAdsMetrics.roas)}</p>
          </div>
        </div>
      </div>

      {/* Performance History */}
      <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <BarChart3 size={16} className="text-accent" /> Evolucao de Conversoes
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={adsPerformanceHistory} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2a42" />
            <XAxis dataKey="month" tick={{ fill: '#7b8ba8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#7b8ba8', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="googleConv" name="Google Ads" fill="#7c5cfc" radius={[6, 6, 0, 0]} />
            <Bar dataKey="instaConv" name="Instagram Ads" fill="#f0427a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Campaigns Table */}
      <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Target size={16} className="text-primary" /> Campanhas Ativas
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-text-secondary border-b border-surface-lighter">
                <th className="text-left py-2 px-3">Campanha</th>
                <th className="text-left py-2 px-3">Plataforma</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-right py-2 px-3">Orcamento</th>
                <th className="text-right py-2 px-3">Gasto</th>
                <th className="text-right py-2 px-3">Cliques</th>
                <th className="text-right py-2 px-3">Conv.</th>
                <th className="text-right py-2 px-3">CPA</th>
              </tr>
            </thead>
            <tbody>
              {adsCampaigns.map((c) => (
                <tr key={c.id} className="border-b border-surface-lighter/50 hover:bg-surface-light transition-colors">
                  <td className="py-2.5 px-3 font-medium text-text-primary">{c.name}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      c.platform === 'Google Ads' ? 'bg-primary/20 text-primary' : 'bg-instagram/20 text-instagram'
                    }`}>{c.platform}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`flex items-center gap-1 text-xs ${
                      c.status === 'active' ? 'text-success' : 'text-warning'
                    }`}>
                      {c.status === 'active' ? <Play size={10} /> : <Pause size={10} />}
                      {c.status === 'active' ? 'Ativa' : 'Pausada'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-text-secondary">{fmtBRL(c.budget)}</td>
                  <td className="py-2.5 px-3 text-right text-text-primary">{fmtBRL(c.spent)}</td>
                  <td className="py-2.5 px-3 text-right text-text-primary">{fmt(c.clicks)}</td>
                  <td className="py-2.5 px-3 text-right text-success font-medium">{c.conversions}</td>
                  <td className="py-2.5 px-3 text-right text-warning">{fmtBRL(c.cpa)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
