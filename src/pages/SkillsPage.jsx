import { useState } from 'react';
import {
  Zap, Play, Pause, Trash2, Plus, Clock, CheckCircle2, Settings,
  RefreshCcw, Calendar, BarChart3
} from 'lucide-react';
import { skills } from '../data/mockData';

export default function SkillsPage() {
  const [skillList, setSkillList] = useState(skills);
  const [showCreate, setShowCreate] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', description: '', frequency: 'Diario' });

  const toggleStatus = (id) => {
    setSkillList(prev => prev.map(s =>
      s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s
    ));
  };

  const deleteSkill = (id) => {
    setSkillList(prev => prev.filter(s => s.id !== id));
  };

  const createSkill = () => {
    if (!newSkill.name) return;
    const skill = {
      id: Date.now(),
      name: newSkill.name,
      description: newSkill.description,
      frequency: newSkill.frequency,
      status: 'active',
      lastRun: '-',
      nextRun: '2026-03-13',
      runsCompleted: 0,
    };
    setSkillList(prev => [...prev, skill]);
    setNewSkill({ name: '', description: '', frequency: 'Diario' });
    setShowCreate(false);
  };

  const activeCount = skillList.filter(s => s.status === 'active').length;
  const totalRuns = skillList.reduce((s, sk) => s + sk.runsCompleted, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Sistema de Habilidades</h1>
          <p className="text-sm text-text-secondary mt-1">
            Crie, gerencie e agende habilidades automaticas
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 text-white rounded-xl transition-all text-sm font-medium"
        >
          <Plus size={16} /> Nova Habilidade
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-4 text-center">
          <Zap size={20} className="text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-text-primary">{skillList.length}</p>
          <p className="text-xs text-text-secondary">Habilidades Total</p>
        </div>
        <div className="bg-surface border border-success/20 rounded-2xl p-4 text-center">
          <CheckCircle2 size={20} className="text-success mx-auto mb-2" />
          <p className="text-2xl font-bold text-text-primary">{activeCount}</p>
          <p className="text-xs text-text-secondary">Ativas</p>
        </div>
        <div className="bg-surface border border-warning/20 rounded-2xl p-4 text-center">
          <RefreshCcw size={20} className="text-warning mx-auto mb-2" />
          <p className="text-2xl font-bold text-text-primary">{totalRuns}</p>
          <p className="text-xs text-text-secondary">Execucoes</p>
        </div>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-surface border border-primary/30 rounded-2xl p-4 animate-fade-in">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Plus size={16} className="text-primary" /> Criar Nova Habilidade
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Nome da habilidade"
              value={newSkill.name}
              onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
              className="bg-surface-light border border-surface-lighter rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
            />
            <input
              type="text"
              placeholder="Descricao"
              value={newSkill.description}
              onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
              className="bg-surface-light border border-surface-lighter rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
            />
            <div className="flex gap-2">
              <select
                value={newSkill.frequency}
                onChange={(e) => setNewSkill(prev => ({ ...prev, frequency: e.target.value }))}
                className="flex-1 bg-surface-light border border-surface-lighter rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="Diario">Diario</option>
                <option value="7 dias">Semanal</option>
                <option value="15 dias">Quinzenal</option>
                <option value="30 dias">Mensal</option>
              </select>
              <button
                onClick={createSkill}
                className="px-4 py-2 bg-success hover:bg-success/80 text-white rounded-xl transition-colors text-sm font-medium"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Habilidades List */}
      <div className="space-y-3">
        {skillList.map((skill) => (
          <div
            key={skill.id}
            className={`bg-surface border rounded-2xl p-4 transition-all ${
              skill.status === 'active' ? 'border-success/20' : 'border-surface-lighter opacity-70'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  skill.status === 'active' ? 'bg-success/15 text-success' : 'bg-surface-lighter text-text-secondary'
                }`}>
                  <Zap size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-text-primary">{skill.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      skill.status === 'active' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                    }`}>{skill.status === 'active' ? 'Ativa' : 'Pausada'}</span>
                  </div>
                  <p className="text-xs text-text-secondary truncate">{skill.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-text-secondary">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{skill.frequency}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>Proxima: {skill.nextRun}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 size={12} />
                  <span>{skill.runsCompleted}x</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(skill.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    skill.status === 'active'
                      ? 'bg-warning/15 text-warning hover:bg-warning/25'
                      : 'bg-success/15 text-success hover:bg-success/25'
                  }`}
                  title={skill.status === 'active' ? 'Pausar' : 'Ativar'}
                >
                  {skill.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  onClick={() => deleteSkill(skill.id)}
                  className="p-2 rounded-xl bg-danger/15 text-danger hover:bg-danger/25 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Ciclo de Vida */}
            <div className="mt-3 pt-3 border-t border-surface-lighter/40">
              <div className="flex items-center gap-2 overflow-x-auto">
                {['Contexto', 'Execucao', 'Validacao', 'Agendamento', 'Monitoramento'].map((step, i) => (
                  <div key={step} className="flex items-center gap-1 flex-shrink-0">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      i <= 3 ? 'bg-success/15 text-success' : 'bg-surface-lighter text-text-secondary'
                    }`}>
                      {i <= 3 ? <CheckCircle2 size={12} /> : (i + 1)}
                    </div>
                    <span className="text-[10px] text-text-secondary">{step}</span>
                    {i < 4 && <span className="text-text-secondary text-[10px] mx-1">&rarr;</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Como Funcionam as Habilidades */}
      <div className="bg-surface border border-surface-lighter/40 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Como Funcionam as Habilidades</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { step: '1', title: 'Dar contexto', desc: 'Explique a tarefa com detalhes para a IA' },
            { step: '2', title: 'Executar', desc: 'Deixe a IA fazer a tarefa pela primeira vez' },
            { step: '3', title: 'Validar', desc: 'Confira se o resultado atende as expectativas' },
            { step: '4', title: 'Criar habilidade', desc: 'Transforme em habilidade reutilizavel' },
            { step: '5', title: 'Agendar', desc: 'Defina frequencia: diario, semanal, quinzenal' },
            { step: '6', title: 'Gerenciar', desc: 'Liste, edite, pause ou exclua habilidades' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 p-3 bg-surface-light rounded-xl">
              <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{item.title}</p>
                <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
