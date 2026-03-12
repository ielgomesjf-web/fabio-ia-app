import {
  FileText, Download, Calendar, TrendingUp, BarChart3,
  Eye, Users, DollarSign, MessageCircle, Star, Clock
} from 'lucide-react';
import {
  dashboardMetrics, gmnMetrics, googleAdsMetrics, instagramAdsMetrics,
  atendimentoMetrics, whatsappMetrics
} from '../data/mockData';

const fmt = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

const fmtBRL = (n) => 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

const reports = [
  {
    id: 1,
    title: 'Relatorio Mensal Completo',
    description: 'Todas as metricas consolidadas do mes',
    period: 'Marco 2026',
    type: 'Mensal',
    status: 'ready',
    generatedAt: '2026-03-12 09:00',
  },
  {
    id: 2,
    title: 'Performance Google Meu Negocio',
    description: 'Visualizacoes, buscas, cliques e avaliacoes',
    period: 'Marco 2026',
    type: 'GMN',
    status: 'ready',
    generatedAt: '2026-03-12 09:00',
  },
  {
    id: 3,
    title: 'ROI Trafego Pago',
    description: 'ROAS, CPA, conversoes por plataforma',
    period: 'Marco 2026',
    type: 'Ads',
    status: 'ready',
    generatedAt: '2026-03-12 09:00',
  },
  {
    id: 4,
    title: 'Atendimento e Conversao',
    description: 'Funil de atendimento IA e taxas de conversao',
    period: 'Marco 2026',
    type: 'Atendimento',
    status: 'ready',
    generatedAt: '2026-03-12 09:00',
  },
  {
    id: 5,
    title: 'WhatsApp - Leads e Agendamentos',
    description: 'Volume de conversas, leads e agendamentos',
    period: 'Marco 2026',
    type: 'WhatsApp',
    status: 'generating',
    generatedAt: null,
  },
  {
    id: 6,
    title: 'Redes Sociais - Instagram + YouTube',
    description: 'Engajamento, crescimento e performance',
    period: 'Marco 2026',
    type: 'Social',
    status: 'ready',
    generatedAt: '2026-03-12 09:00',
  },
];

export default function RelatoriosPage() {
  const totalInvestment = googleAdsMetrics.cost + instagramAdsMetrics.cost;
  const totalConversions = googleAdsMetrics.conversions + instagramAdsMetrics.leads + atendimentoMetrics.leadsConverted;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Relatorios</h1>
        <p className="text-sm text-text-secondary mt-1">
          Resumo executivo e relatorios detalhados
        </p>
      </div>

      {/* Executive Summary */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-accent" /> Resumo Executivo — Marco 2026
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Visualizacoes GMN', value: fmt(gmnMetrics.profileViews), icon: Eye, color: 'primary' },
            { label: 'Leads Totais', value: fmt(totalConversions), icon: Users, color: 'success' },
            { label: 'Investimento Ads', value: fmtBRL(totalInvestment), icon: DollarSign, color: 'warning' },
            { label: 'Conversas WhatsApp', value: fmt(whatsappMetrics.totalConversations), icon: MessageCircle, color: 'accent' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-surface/80 backdrop-blur rounded-xl p-3 text-center">
                <Icon size={18} className={`text-${item.color} mx-auto mb-2`} />
                <p className="text-lg font-bold text-text-primary">{item.value}</p>
                <p className="text-[10px] text-text-secondary">{item.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {[
            { label: 'Seguidores IG', value: fmt(dashboardMetrics.instagram.followers), change: '+' + dashboardMetrics.instagram.followersChange + '%' },
            { label: 'Inscritos YT', value: fmt(dashboardMetrics.youtube.subscribers), change: '+' + dashboardMetrics.youtube.subscribersChange + '%' },
            { label: 'Nota GMN', value: '4.8/5', change: '347 avaliacoes' },
            { label: 'ROAS Medio', value: ((googleAdsMetrics.roas + instagramAdsMetrics.roas) / 2).toFixed(1) + 'x', change: 'Google + Insta' },
          ].map((item) => (
            <div key={item.label} className="bg-surface/80 backdrop-blur rounded-xl p-3">
              <p className="text-sm font-bold text-text-primary">{item.value}</p>
              <p className="text-[10px] text-text-secondary">{item.label}</p>
              <p className="text-[10px] text-success mt-0.5">{item.change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <FileText size={16} className="text-primary" /> Relatorios Disponiveis
        </h3>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center gap-4 p-4 bg-surface-light/60 rounded-xl border border-surface-lighter/30 hover:border-primary/20 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                report.status === 'ready' ? 'bg-primary/15 text-primary' : 'bg-warning/15 text-warning'
              }`}>
                <FileText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-text-primary">{report.title}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    report.type === 'Mensal' ? 'bg-accent/20 text-accent' :
                    report.type === 'GMN' ? 'bg-primary/20 text-primary' :
                    report.type === 'Ads' ? 'bg-warning/20 text-warning' :
                    report.type === 'Social' ? 'bg-instagram/20 text-instagram' :
                    report.type === 'WhatsApp' ? 'bg-success/20 text-success' :
                    'bg-info/20 text-info'
                  }`}>{report.type}</span>
                </div>
                <p className="text-xs text-text-secondary">{report.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-text-secondary flex items-center gap-1">
                    <Calendar size={8} /> {report.period}
                  </span>
                  {report.generatedAt && (
                    <span className="text-[10px] text-text-secondary flex items-center gap-1">
                      <Clock size={8} /> {report.generatedAt}
                    </span>
                  )}
                </div>
              </div>
              <button className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                report.status === 'ready'
                  ? 'bg-primary hover:bg-primary-dark text-white'
                  : 'bg-surface-lighter text-text-secondary cursor-not-allowed'
              }`}>
                {report.status === 'ready' ? (
                  <><Download size={12} /> Baixar PDF</>
                ) : (
                  <><Clock size={12} /> Gerando...</>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats for Report */}
      <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Metricas Chave para Relatorio</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Buscas GMN', value: fmt(gmnMetrics.searchAppearances), icon: Eye },
            { label: 'Cliques Site', value: fmt(gmnMetrics.websiteClicks), icon: TrendingUp },
            { label: 'Ligacoes', value: fmt(gmnMetrics.phoneCallClicks), icon: Star },
            { label: 'Leads Ads', value: googleAdsMetrics.conversions + instagramAdsMetrics.leads, icon: Users },
            { label: 'Atendimento IA', value: atendimentoMetrics.aiHandledPercent + '%', icon: BarChart3 },
            { label: 'WhatsApp Leads', value: fmt(whatsappMetrics.leadsCapturados), icon: MessageCircle },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="p-3 bg-surface-light/60 rounded-xl text-center border border-surface-lighter/30">
                <Icon size={14} className="text-accent mx-auto mb-1.5" />
                <p className="text-sm font-bold text-text-primary">{item.value}</p>
                <p className="text-[10px] text-text-secondary">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
