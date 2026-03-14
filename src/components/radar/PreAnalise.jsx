import { useState } from 'react';
import {
  CheckCircle2, XCircle, AlertTriangle, Search, RefreshCw,
  ChevronDown, ChevronUp, Lightbulb, Shield
} from 'lucide-react';
import { radarPreAnalise } from '../../data/radarMockData';

const priorityConfig = {
  high: { label: 'Alta', bg: 'bg-danger/15', text: 'text-danger' },
  medium: { label: 'Média', bg: 'bg-warning/15', text: 'text-warning' },
  low: { label: 'Baixa', bg: 'bg-info/15', text: 'text-info' },
};

function ScoreGauge({ score, maxScore, color }) {
  const percentage = (score / maxScore) * 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <circle
          cx="80" cy="80" r={radius}
          stroke="#1e2a42"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="80" cy="80" r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-text-primary">{score}</span>
        <span className="text-sm text-text-secondary">/ {maxScore}</span>
      </div>
    </div>
  );
}

export default function PreAnalise({ business, onAnalyze }) {
  const [data] = useState(radarPreAnalise);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const score = data.checks.reduce((sum, c) => sum + (c.status === 'ok' ? c.points : 0), 0);
  const maxScore = data.checks.reduce((sum, c) => sum + c.points, 0);
  const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';
  const gradeColor = score >= 80 ? '#34dd87' : score >= 60 ? '#ffad00' : score >= 40 ? '#f97316' : '#ff4a6e';

  const passedCount = data.checks.filter(c => c.status === 'ok').length;
  const failedCount = data.checks.filter(c => c.status === 'fail').length;

  // Agrupar checks por categoria
  const categories = {};
  data.checks.forEach(check => {
    if (!categories[check.category]) categories[check.category] = [];
    categories[check.category].push(check);
  });

  // Recomendações = itens que falharam, ordenados por prioridade
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const recommendations = data.checks
    .filter(c => c.status === 'fail')
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simular análise (em produção, chamaria radarApi.getPlaceDetails)
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Business Search Bar */}
      <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar negócio pelo nome..."
              className="w-full bg-surface-light/60 border border-surface-lighter/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />
            {isAnalyzing ? 'Analisando...' : 'Analisar Perfil'}
          </button>
        </div>
      </div>

      {/* Score + Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Score Gauge */}
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-6 flex flex-col items-center justify-center">
          <ScoreGauge score={score} maxScore={maxScore} color={gradeColor} />
          <div className="mt-3 flex items-center gap-2">
            <span
              className="text-lg font-bold px-3 py-1 rounded-lg"
              style={{ backgroundColor: gradeColor + '20', color: gradeColor }}
            >
              Nota {grade}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-2">{data.business.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-success/15 flex items-center justify-center">
                <CheckCircle2 size={16} className="text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-text-primary">{passedCount}</p>
            <p className="text-xs text-text-secondary">Itens OK</p>
          </div>
          <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-danger/15 flex items-center justify-center">
                <XCircle size={16} className="text-danger" />
              </div>
            </div>
            <p className="text-2xl font-bold text-text-primary">{failedCount}</p>
            <p className="text-xs text-text-secondary">Pendentes</p>
          </div>
          <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-warning/15 flex items-center justify-center">
                <AlertTriangle size={16} className="text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-text-primary">{recommendations.filter(r => r.priority === 'high').length}</p>
            <p className="text-xs text-text-secondary">Alta Prioridade</p>
          </div>
          <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                <Shield size={16} className="text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-text-primary">{Math.round((passedCount / data.checks.length) * 100)}%</p>
            <p className="text-xs text-text-secondary">Completude</p>
          </div>
        </div>
      </div>

      {/* Checklist por Categoria */}
      <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-accent" />
          Checklist do Perfil
        </h3>
        <div className="space-y-2">
          {Object.entries(categories).map(([categoryName, checks]) => {
            const catPassed = checks.filter(c => c.status === 'ok').length;
            const isExpanded = expandedCategory === categoryName;

            return (
              <div key={categoryName} className="border border-surface-lighter/30 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : categoryName)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-surface-light/40 hover:bg-surface-light/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-text-primary">{categoryName}</span>
                    <span className="text-xs text-text-secondary">{catPassed}/{checks.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-surface-lighter rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                        style={{ width: `${(catPassed / checks.length) * 100}%` }}
                      />
                    </div>
                    {isExpanded ? <ChevronUp size={14} className="text-text-secondary" /> : <ChevronDown size={14} className="text-text-secondary" />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 py-2 space-y-1.5">
                    {checks.map(check => {
                      const pCfg = priorityConfig[check.priority];
                      return (
                        <div key={check.id} className={`flex items-center justify-between py-2 px-3 rounded-lg ${check.status === 'fail' ? 'bg-danger/5' : ''}`}>
                          <div className="flex items-center gap-2.5">
                            {check.status === 'ok' ? (
                              <CheckCircle2 size={14} className="text-success flex-shrink-0" />
                            ) : (
                              <XCircle size={14} className="text-danger flex-shrink-0" />
                            )}
                            <span className={`text-sm ${check.status === 'ok' ? 'text-text-secondary' : 'text-text-primary'}`}>
                              {check.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${pCfg.bg} ${pCfg.text}`}>
                              {pCfg.label}
                            </span>
                            <span className="text-xs text-text-secondary w-8 text-right">
                              {check.status === 'ok' ? `+${check.points}` : '0'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recomendações */}
      {recommendations.length > 0 && (
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Lightbulb size={16} className="text-warning" />
            Top Recomendações
          </h3>
          <div className="space-y-2">
            {recommendations.map((rec, i) => {
              const pCfg = priorityConfig[rec.priority];
              return (
                <div key={rec.id} className="flex items-center gap-3 p-3 bg-surface-light/40 rounded-xl border border-surface-lighter/30">
                  <span className="w-6 h-6 rounded-full bg-warning/15 text-warning text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary">{rec.label}</p>
                    <p className="text-[10px] text-text-secondary">{rec.category} &middot; +{rec.points} pontos</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${pCfg.bg} ${pCfg.text} flex-shrink-0`}>
                    {pCfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
