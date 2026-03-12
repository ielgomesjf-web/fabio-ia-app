import { TrendingUp, Flame, Zap, ExternalLink, Play, Film } from 'lucide-react';

const viralContent = [
  { id: 1, platform: 'TikTok', title: 'IA que transforma qualquer foto em video cinematografico', views: '12.4M', engagement: '890K', trend: 'IA Generativa', daysAgo: 2 },
  { id: 2, platform: 'Instagram', title: 'Truque do Canva que parece After Effects', views: '8.7M', engagement: '560K', trend: 'Design Hacks', daysAgo: 3 },
  { id: 3, platform: 'YouTube', title: 'Ganhei R$50k em 30 dias como criador', views: '2.1M', engagement: '180K', trend: 'Monetizacao', daysAgo: 5 },
  { id: 4, platform: 'TikTok', title: 'ChatGPT com voz fez isso e eu fiquei chocado', views: '18.9M', engagement: '1.2M', trend: 'ChatGPT', daysAgo: 1 },
  { id: 5, platform: 'Instagram', title: 'De 0 a 100k seguidores em 90 dias - o metodo', views: '5.3M', engagement: '420K', trend: 'Growth', daysAgo: 4 },
  { id: 6, platform: 'YouTube', title: 'As 3 IAs que vao substituir freelancers em 2026', views: '3.8M', engagement: '290K', trend: 'IA no Trabalho', daysAgo: 2 },
];

const shortsIdeas = [
  { id: 1, title: 'Motion no Canva em 15 segundos', format: 'Tutorial ultra-rapido', duration: '15s', viralScore: 9.5, hook: 'Voce so precisa de 2 cliques...', reason: 'Formato "speed tutorial" tem 3x mais retencao em Reels' },
  { id: 2, title: 'Transformei foto em video viral com 1 clique', format: 'Antes/Depois', duration: '20s', viralScore: 9.2, hook: 'Olha essa foto... agora olha isso!', reason: 'Formato antes/depois tem a maior taxa de compartilhamento' },
  { id: 3, title: 'IA respondeu minha DM automaticamente', format: 'Revelacao', duration: '18s', viralScore: 8.8, hook: 'Recebi 200 DMs e respondi todas em 5 minutos', reason: 'Automacao + resultado impressionante gera curiosidade' },
  { id: 4, title: '3 apps gratis que parecem pagos', format: 'Lista rapida', duration: '25s', viralScore: 8.5, hook: 'O terceiro vai te chocar...', reason: 'Listas com "gratis" tem CTR 40% maior' },
  { id: 5, title: 'Copiei o design de R$5.000 em 30 seg', format: 'Desafio', duration: '30s', viralScore: 9.0, hook: 'Um cliente pagou R$5.000 nesse design. Eu fiz em 30 segundos.', reason: 'Comparacao valor vs tempo gera alta polarizacao e debate' },
  { id: 6, title: 'O prompt que vale R$1.000', format: 'Revelacao', duration: '15s', viralScore: 8.7, hook: 'Esse unico prompt gera R$1.000 por semana pra mim', reason: 'Promessa de valor monetario especifico aumenta saves' },
  { id: 7, title: 'Editei esse video inteiro com a voz', format: 'Tutorial', duration: '22s', viralScore: 8.3, hook: 'Nao toquei no mouse nenhuma vez...', reason: 'Edicao por voz e novidade e gera WOW factor' },
  { id: 8, title: 'IA adivinhou minha profissao pela foto', format: 'Trend/Humor', duration: '12s', viralScore: 9.1, hook: 'Mandei minha foto pra IA e ela disse...', reason: 'Trends de IA analisando fotos viralizam organicamente' },
  { id: 9, title: 'Criei uma marca inteira com IA em 2 min', format: 'Speed-run', duration: '28s', viralScore: 8.9, hook: 'Logo, paleta, nome, site. Tudo com IA.', reason: 'Speed-runs de criacao mostram poder da IA de forma tangivel' },
  { id: 10, title: 'O erro que ta matando seu alcance', format: 'Educativo', duration: '20s', viralScore: 8.4, hook: 'Se voce faz isso no Reels, para AGORA', reason: 'Conteudo "erro" gera urgencia e salvamentos' },
];

const platformColors = {
  TikTok: 'bg-pink-500/20 text-pink-400',
  Instagram: 'bg-instagram/20 text-instagram',
  YouTube: 'bg-youtube/20 text-youtube',
};

export default function ViralResearch() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Pesquisa Viral + Shorts</h1>
        <p className="text-sm text-text-secondary mt-1">
          Conteudos virais no nicho + 10 ideias estrategicas de shorts/reels
        </p>
      </div>

      {/* Viral Content Found */}
      <div className="bg-surface border border-surface-lighter rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Flame size={16} className="text-orange-400" /> Conteudos Virais no Nicho (esta semana)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {viralContent.map((item) => (
            <div key={item.id} className="p-3 bg-surface-light rounded-lg border border-surface-lighter hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${platformColors[item.platform]}`}>
                  {item.platform}
                </span>
                <span className="text-xs text-text-secondary">ha {item.daysAgo}d</span>
              </div>
              <p className="text-sm font-medium text-text-primary mb-2">{item.title}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary flex items-center gap-1">
                    <Play size={10} /> {item.views}
                  </span>
                  <span className="text-xs text-text-secondary flex items-center gap-1">
                    <TrendingUp size={10} /> {item.engagement}
                  </span>
                </div>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{item.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shorts/Reels Ideas */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Film size={16} className="text-primary" /> 10 Ideias de Shorts/Reels Estrategicas
        </h3>
        <div className="space-y-3">
          {shortsIdeas.map((idea, i) => (
            <div key={idea.id} className="bg-surface border border-surface-lighter rounded-xl p-4 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                  idea.viralScore >= 9 ? 'bg-success/20 text-success' :
                  idea.viralScore >= 8.5 ? 'bg-warning/20 text-warning' :
                  'bg-info/20 text-info'
                }`}>
                  {idea.viralScore}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{idea.format}</span>
                    <span className="text-xs text-text-secondary">{idea.duration}</span>
                  </div>
                  <p className="text-sm font-semibold text-text-primary">{idea.title}</p>
                  <p className="text-xs text-orange-400 mt-1">
                    <Zap size={10} className="inline" /> Hook: "{idea.hook}"
                  </p>
                  <p className="text-xs text-text-secondary mt-1.5">
                    <TrendingUp size={10} className="inline text-success" /> {idea.reason}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
