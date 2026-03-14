import { Users, Lock } from 'lucide-react';

export default function ComparativoConcorrentes() {
  return (
    <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Users size={32} className="text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">Comparativo de Concorrentes</h3>
      <p className="text-sm text-text-secondary mb-4 max-w-md mx-auto">
        Compare seu perfil lado a lado com os principais concorrentes.
        Veja nota, volume de avaliações, fotos e completude do perfil.
      </p>
      <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full">
        <Lock size={12} /> Sprint 2
      </span>
    </div>
  );
}
