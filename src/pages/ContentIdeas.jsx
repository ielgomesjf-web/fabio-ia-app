import { useState } from 'react';
import { Lightbulb, Flame, Clock, Hash, Copy, Check, Sparkles } from 'lucide-react';
import { contentIdeas } from '../data/mockData';

export default function ContentIdeas() {
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Gerador de Ideias</h1>
        <p className="text-sm text-text-secondary mt-1">
          10 ideias baseadas na sua performance + tendencias virais
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ideas List */}
        <div className="lg:col-span-2 space-y-3">
          {contentIdeas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => setSelectedIdea(idea)}
              className={`bg-surface border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-primary/40 ${
                selectedIdea?.id === idea.id ? 'border-primary/60 ring-1 ring-primary/20' : 'border-surface-lighter'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Score */}
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
                  idea.potential >= 9 ? 'bg-success/20 text-success' :
                  idea.potential >= 8 ? 'bg-warning/20 text-warning' :
                  'bg-info/20 text-info'
                }`}>
                  <span className="text-lg font-bold">{idea.potential}</span>
                  <span className="text-[8px] -mt-1">score</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      idea.format === 'Reel' ? 'bg-instagram/20 text-instagram' :
                      idea.format === 'Carrossel' ? 'bg-primary/20 text-primary' :
                      idea.format === 'Video longo' ? 'bg-youtube/20 text-youtube' :
                      'bg-warning/20 text-warning'
                    }`}>{idea.format}</span>
                    <span className="text-xs text-text-secondary">{idea.theme}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${
                      idea.urgency === 'Publicar hoje' ? 'bg-danger/20 text-danger' :
                      idea.urgency === 'Esta semana' ? 'bg-warning/20 text-warning' :
                      'bg-info/20 text-info'
                    }`}>
                      {idea.urgency}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-text-primary">{idea.title}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    <Flame size={10} className="inline text-orange-400" /> Hook: "{idea.hook}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedIdea ? (
            <div className="bg-surface border border-surface-lighter rounded-xl p-4 sticky top-4 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <h3 className="text-sm font-semibold text-text-primary">Detalhes da Ideia</h3>
              </div>

              <div>
                <p className="text-lg font-bold text-text-primary">{selectedIdea.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedIdea.potential >= 9 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                  }`}>Score: {selectedIdea.potential}/10</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{selectedIdea.format}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-surface-light rounded-lg">
                  <p className="text-xs text-text-secondary mb-1">Hook (primeiros 3s)</p>
                  <p className="text-sm text-text-primary">"{selectedIdea.hook}"</p>
                </div>

                <div className="p-3 bg-surface-light rounded-lg">
                  <p className="text-xs text-text-secondary mb-1 flex items-center gap-1">
                    <Clock size={10} /> Melhor horario
                  </p>
                  <p className="text-sm text-text-primary">{selectedIdea.bestTime}</p>
                </div>

                <div className="p-3 bg-surface-light rounded-lg">
                  <p className="text-xs text-text-secondary mb-1 flex items-center gap-1">
                    <Hash size={10} /> Hashtags
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedIdea.hashtags.map((h) => (
                      <span key={h} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{h}</span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-surface-light rounded-lg">
                  <p className="text-xs text-text-secondary mb-1">Urgencia</p>
                  <p className={`text-sm font-medium ${
                    selectedIdea.urgency === 'Publicar hoje' ? 'text-danger' :
                    selectedIdea.urgency === 'Esta semana' ? 'text-warning' : 'text-info'
                  }`}>{selectedIdea.urgency}</p>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(
                  `Titulo: ${selectedIdea.title}\nFormato: ${selectedIdea.format}\nHook: ${selectedIdea.hook}\nHashtags: ${selectedIdea.hashtags.join(' ')}\nMelhor horario: ${selectedIdea.bestTime}`,
                  selectedIdea.id
                )}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium"
              >
                {copied === selectedIdea.id ? (
                  <><Check size={14} /> Copiado!</>
                ) : (
                  <><Copy size={14} /> Copiar briefing</>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-surface border border-surface-lighter rounded-xl p-6 text-center">
              <Lightbulb size={32} className="text-text-secondary mx-auto mb-3" />
              <p className="text-sm text-text-secondary">Selecione uma ideia para ver detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
