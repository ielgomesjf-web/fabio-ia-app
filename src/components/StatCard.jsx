import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, icon: Icon, color = 'primary', subtitle }) {
  const isPositive = change >= 0;

  const colorMap = {
    primary: 'from-primary/15 to-transparent border-primary/15 hover:border-primary/30',
    instagram: 'from-instagram/15 to-transparent border-instagram/15 hover:border-instagram/30',
    youtube: 'from-youtube/15 to-transparent border-youtube/15 hover:border-youtube/30',
    success: 'from-success/15 to-transparent border-success/15 hover:border-success/30',
    warning: 'from-warning/15 to-transparent border-warning/15 hover:border-warning/30',
    info: 'from-info/15 to-transparent border-info/15 hover:border-info/30',
  };

  const iconColorMap = {
    primary: 'text-primary bg-primary/10',
    instagram: 'text-instagram bg-instagram/10',
    youtube: 'text-youtube bg-youtube/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    info: 'text-info bg-info/10',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-4 animate-fade-in transition-all duration-300 backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${iconColorMap[color]}`}>
          <Icon size={18} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPositive ? 'text-success bg-success/10' : 'text-danger bg-danger/10'
          }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-text-primary tracking-tight">{value}</p>
      <p className="text-xs text-text-secondary mt-1.5">{title}</p>
      {subtitle && <p className="text-[10px] text-text-secondary mt-0.5">{subtitle}</p>}
    </div>
  );
}
