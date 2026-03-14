import { useState } from 'react';
import {
  Radar, Map, Search, Star, Users, ScanSearch
} from 'lucide-react';
import PreAnalise from '../components/radar/PreAnalise';
import BuscaLeads from '../components/radar/BuscaLeads';
import GeoGrid from '../components/radar/GeoGrid';
import AnaliseAvaliacoes from '../components/radar/AnaliseAvaliacoes';
import ComparativoConcorrentes from '../components/radar/ComparativoConcorrentes';

const TABS = [
  { id: 'pre-analise', label: 'Pré-Análise', icon: ScanSearch },
  { id: 'busca-leads', label: 'Busca de Leads', icon: Search },
  { id: 'geo-grid', label: 'Geo-Grid', icon: Map },
  { id: 'avaliacoes', label: 'Avaliações', icon: Star },
  { id: 'concorrentes', label: 'Concorrentes', icon: Users },
];

export default function RadarPresencaPage() {
  const [activeTab, setActiveTab] = useState('pre-analise');
  const [business] = useState({
    name: 'Studio Digital Pro',
    address: 'Av. Rio Branco, 1234 - Centro, Juiz de Fora - MG',
    placeId: '',
    lat: -21.7628,
    lng: -43.3497,
  });

  const renderTab = () => {
    switch (activeTab) {
      case 'pre-analise': return <PreAnalise business={business} />;
      case 'busca-leads': return <BuscaLeads business={business} />;
      case 'geo-grid': return <GeoGrid business={business} />;
      case 'avaliacoes': return <AnaliseAvaliacoes business={business} />;
      case 'concorrentes': return <ComparativoConcorrentes business={business} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Radar size={24} className="text-accent" />
            Radar Presença
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Análise completa de presença digital local
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-warning/10 text-warning border border-warning/20">
          <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
          Modo Demo
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-surface-light/50 rounded-2xl overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm shadow-primary/25'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-light/60'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      {renderTab()}
    </div>
  );
}
