import {
  Instagram, Youtube, Mail, BookOpen, Globe, Check, X, RefreshCcw, ExternalLink, Plug
} from 'lucide-react';
import { connections } from '../data/mockData';

const iconMap = {
  Instagram, Youtube, Mail, BookOpen, Globe,
};

export default function ConnectionsPage() {
  const connected = connections.filter(c => c.status === 'connected').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Conexoes Externas</h1>
        <p className="text-sm text-text-secondary mt-1">
          {connected}/{connections.length} apps conectados
        </p>
      </div>

      {/* Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((conn) => {
          const Icon = iconMap[conn.icon] || Globe;
          const isConnected = conn.status === 'connected';

          return (
            <div
              key={conn.id}
              className={`bg-surface border rounded-xl p-5 transition-all ${
                isConnected ? 'border-success/20' : 'border-surface-lighter'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isConnected ? 'bg-success/20 text-success' : 'bg-surface-lighter text-text-secondary'
                }`}>
                  <Icon size={24} />
                </div>
                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  isConnected ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                }`}>
                  {isConnected ? <Check size={10} /> : <X size={10} />}
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-text-primary">{conn.name}</h3>
              <p className="text-xs text-text-secondary mt-1">{conn.description}</p>

              {conn.lastSync && (
                <p className="text-xs text-text-secondary mt-3 flex items-center gap-1">
                  <RefreshCcw size={10} /> Sincronizado: {conn.lastSync}
                </p>
              )}

              <button
                className={`w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isConnected
                    ? 'bg-surface-light text-text-secondary hover:bg-surface-lighter'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {isConnected ? (
                  <><RefreshCcw size={14} /> Reconectar</>
                ) : (
                  <><Plug size={14} /> Conectar</>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* How to Reproduce */}
      <div className="bg-surface border border-surface-lighter rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Como Reproduzir em Outras Plataformas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { platform: 'Claude', desc: 'Conecta com Gmail e Google Calendar via MCP' },
            { platform: 'ChatGPT', desc: 'Conecta com Google Drive, Zapier, browsing' },
            { platform: 'Make/n8n', desc: 'Conecta com 1000+ apps via API' },
            { platform: 'Alternativa', desc: 'Exportar dados manualmente e colar no prompt' },
          ].map((item) => (
            <div key={item.platform} className="flex items-start gap-3 p-3 bg-surface-light rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                <ExternalLink size={14} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{item.platform}</p>
                <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Browser Capabilities */}
      <div className="bg-surface border border-surface-lighter rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Globe size={16} className="text-primary" /> Navegador Autonomo na Nuvem
        </h3>
        <p className="text-xs text-text-secondary mb-3">
          Capacidades do navegador autonomo operado pela Fabio IA:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {[
            'Navegar em sites',
            'Clicar em botoes',
            'Preencher formularios',
            'Extrair dados',
            'Fluxos multi-etapa',
            'Publicar em redes',
            'Funcionar 24/7',
            'Screenshots automaticos',
          ].map((cap) => (
            <div key={cap} className="flex items-center gap-2 p-2 bg-surface-light rounded-lg">
              <Check size={12} className="text-success flex-shrink-0" />
              <span className="text-xs text-text-primary">{cap}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
