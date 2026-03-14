import { Map, Lock } from 'lucide-react';

export default function GeoGrid() {
  return (
    <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
        <Map size={32} className="text-accent" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">Geo-Grid Heatmap</h3>
      <p className="text-sm text-text-secondary mb-4 max-w-md mx-auto">
        Mapa de calor mostrando o ranking do seu negócio em diferentes pontos geográficos.
        Visualize onde você aparece no top 3 do Google Maps.
      </p>
      <div className="flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full">
          <Lock size={12} /> Sprint 2
        </span>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2 max-w-[200px] mx-auto opacity-30">
        {[...Array(9)].map((_, i) => (
          <div key={i} className={`w-full aspect-square rounded-lg ${
            i === 4 ? 'bg-primary' : [0, 2, 6].includes(i) ? 'bg-success' : [1, 3, 5].includes(i) ? 'bg-warning' : 'bg-danger'
          }`} />
        ))}
      </div>
    </div>
  );
}
