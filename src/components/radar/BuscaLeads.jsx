import { useState } from 'react';
import {
  Search, MapPin, ExternalLink, MessageCircle, Star,
  Globe, Phone, Image, Clock, Reply, ChevronDown, Loader2, Filter
} from 'lucide-react';
import { searchLeads } from '../../services/radarApi';
import { radarLeadResults } from '../../data/radarMockData';

const CATEGORIES = [
  'Todos', 'Restaurante', 'Barbearia', 'Dentista', 'Academia',
  'Pet Shop', 'Salão de Beleza', 'Pizzaria', 'Oficina Mecânica',
  'Cafeteria', 'Loja de Roupas', 'Serviço de Entrega',
];

function getScoreConfig(score) {
  if (score >= 70) return { label: 'Oportunidade', bg: 'bg-success/15', text: 'text-success', border: 'border-success/20' };
  if (score >= 40) return { label: 'Potencial', bg: 'bg-warning/15', text: 'text-warning', border: 'border-warning/20' };
  return { label: 'Forte', bg: 'bg-primary/15', text: 'text-primary', border: 'border-primary/20' };
}

const flagConfig = {
  'Sem website': { icon: Globe, color: 'text-danger' },
  'Sem telefone': { icon: Phone, color: 'text-danger' },
  'Sem fotos': { icon: Image, color: 'text-danger' },
  'Poucas fotos': { icon: Image, color: 'text-warning' },
  'Nota baixa': { icon: Star, color: 'text-warning' },
  'Poucas avaliações': { icon: Star, color: 'text-warning' },
  'Sem horário': { icon: Clock, color: 'text-warning' },
  'Sem respostas a avaliações': { icon: Reply, color: 'text-warning' },
};

function LeadCard({ lead }) {
  const scoreConfig = getScoreConfig(lead.weaknessScore);

  const whatsappMessage = encodeURIComponent(
    `Olá! Vi que o ${lead.name} tem presença no Google. ` +
    `Gostaria de apresentar uma proposta para melhorar seus resultados online. ` +
    `Posso enviar um diagnóstico gratuito?`
  );
  const whatsappNumber = lead.phone ? lead.phone.replace(/\D/g, '') : '';

  return (
    <div className={`bg-surface border rounded-2xl p-4 transition-all hover:border-surface-lighter/60 ${scoreConfig.border}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-primary truncate">{lead.name}</h4>
          <p className="text-[10px] text-text-secondary mt-0.5">{lead.category}</p>
        </div>
        <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${scoreConfig.bg} ${scoreConfig.text} flex-shrink-0 ml-2`}>
          {scoreConfig.label}
        </span>
      </div>

      {/* Address */}
      <div className="flex items-start gap-1.5 mb-3">
        <MapPin size={12} className="text-text-secondary mt-0.5 flex-shrink-0" />
        <p className="text-xs text-text-secondary leading-relaxed">{lead.address}</p>
      </div>

      {/* Rating + Reviews */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className={i < Math.floor(lead.rating) ? 'text-warning fill-warning' : 'text-surface-lighter'} />
          ))}
          <span className="text-xs font-medium text-text-primary ml-1">{lead.rating}</span>
        </div>
        <span className="text-[10px] text-text-secondary">({lead.userRatingCount} avaliações)</span>
      </div>

      {/* Weakness Score Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-text-secondary">Fragilidade Digital</span>
          <span className={`text-xs font-bold ${scoreConfig.text}`}>{lead.weaknessScore}%</span>
        </div>
        <div className="w-full bg-surface-lighter rounded-full h-1.5">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${lead.weaknessScore}%`,
              backgroundColor: lead.weaknessScore >= 70 ? '#34dd87' : lead.weaknessScore >= 40 ? '#ffad00' : '#7c5cfc',
            }}
          />
        </div>
      </div>

      {/* Missing Signals */}
      {lead.missingSignals.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {lead.missingSignals.map(signal => {
            const cfg = flagConfig[signal] || { icon: Star, color: 'text-text-secondary' };
            const Icon = cfg.icon;
            return (
              <span key={signal} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-surface-light/80 border border-surface-lighter/30">
                <Icon size={9} className={cfg.color} />
                <span className="text-text-secondary">{signal}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-surface-lighter/30">
        {lead.googleMapsUri ? (
          <a
            href={lead.googleMapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-text-secondary hover:text-accent bg-surface-light/50 hover:bg-surface-light rounded-xl transition-all"
          >
            <ExternalLink size={12} /> Maps
          </a>
        ) : (
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(lead.name + ' ' + lead.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-text-secondary hover:text-accent bg-surface-light/50 hover:bg-surface-light rounded-xl transition-all"
          >
            <ExternalLink size={12} /> Maps
          </a>
        )}
        {whatsappNumber && (
          <a
            href={`https://wa.me/55${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-white bg-success/80 hover:bg-success rounded-xl transition-all"
          >
            <MessageCircle size={12} /> WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

export default function BuscaLeads() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('Juiz de Fora, MG');
  const [radius, setRadius] = useState(5);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState('weakness');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const handleSearch = async () => {
    setIsLoading(true);
    setSearched(true);
    try {
      const data = await searchLeads(
        query || selectedCategory !== 'Todos' ? `${selectedCategory !== 'Todos' ? selectedCategory : ''} ${query}`.trim() : '',
        { lat: -21.7628, lng: -43.3497 }, // Juiz de Fora default
        radius
      );
      setResults(data);
    } catch {
      // Fallback para mock
      setResults(radarLeadResults);
    }
    setIsLoading(false);
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'weakness') return b.weaknessScore - a.weaknessScore;
    if (sortBy === 'rating') return a.rating - b.rating;
    if (sortBy === 'reviews') return a.userRatingCount - b.userRatingCount;
    return 0;
  });

  const filteredResults = selectedCategory === 'Todos'
    ? sortedResults
    : sortedResults.filter(r => r.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="space-y-5">
      {/* Search Form */}
      <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Search size={16} className="text-accent" />
          Buscar Leads
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword */}
          <div>
            <label className="text-[10px] text-text-secondary mb-1 block">Palavra-chave</label>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ex: delivery, implante..."
              className="w-full bg-surface-light/60 border border-surface-lighter/50 rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* City */}
          <div>
            <label className="text-[10px] text-text-secondary mb-1 block">Cidade</label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Juiz de Fora, MG"
              className="w-full bg-surface-light/60 border border-surface-lighter/50 rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Radius */}
          <div>
            <label className="text-[10px] text-text-secondary mb-1 block">Raio: {radius}km</label>
            <input
              type="range"
              min={1}
              max={20}
              value={radius}
              onChange={e => setRadius(Number(e.target.value))}
              className="w-full accent-primary mt-2"
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Search size={14} />
              )}
              {isLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-1.5 mt-4 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-surface-light/50 text-text-secondary hover:text-text-primary hover:bg-surface-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {searched && (
        <>
          {/* Sort & Count */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-secondary">
              {filteredResults.length} lead{filteredResults.length !== 1 ? 's' : ''} encontrado{filteredResults.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-text-secondary" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-surface-light/60 border border-surface-lighter/50 rounded-lg px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-primary/50"
              >
                <option value="weakness">Maior Oportunidade</option>
                <option value="rating">Menor Nota</option>
                <option value="reviews">Menos Avaliações</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 size={32} className="text-primary animate-spin mb-3" />
              <p className="text-sm text-text-secondary">Buscando leads na região...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search size={32} className="text-text-secondary mb-3" />
              <p className="text-sm text-text-secondary">Nenhum lead encontrado</p>
              <p className="text-xs text-text-secondary mt-1">Tente ajustar os filtros ou expandir o raio</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredResults.map(lead => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!searched && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
            <Search size={28} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Encontre Oportunidades</h3>
          <p className="text-sm text-text-secondary max-w-md">
            Busque negócios locais com presença digital fraca. Identifique oportunidades de venda
            com base em perfis incompletos no Google.
          </p>
        </div>
      )}
    </div>
  );
}
