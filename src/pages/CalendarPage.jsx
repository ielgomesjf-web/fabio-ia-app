import { Calendar as CalIcon, Instagram, Youtube, ChevronLeft, ChevronRight } from 'lucide-react';
import { calendarEvents } from '../data/mockData';

const statusColors = {
  today: 'border-l-success bg-success/10',
  scheduled: 'border-l-primary bg-primary/10',
  idea: 'border-l-warning bg-warning/10',
};

const statusLabels = {
  today: 'Hoje',
  scheduled: 'Agendado',
  idea: 'Ideia',
};

export default function CalendarPage() {
  // Build a simple 2-week calendar grid
  const today = new Date(2026, 2, 12); // March 12, 2026
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push(d);
  }

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarEvents.filter(e => e.date === dateStr);
  };

  const isToday = (date) => {
    return date.toISOString().split('T')[0] === '2026-03-12';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Calendario de Conteudo</h1>
          <p className="text-sm text-text-secondary mt-1">Planejamento das proximas 2 semanas</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="flex items-center gap-1 text-xs text-text-secondary mr-3">
            <span className="w-2 h-2 rounded-full bg-success"></span> Hoje
            <span className="w-2 h-2 rounded-full bg-primary ml-2"></span> Agendado
            <span className="w-2 h-2 rounded-full bg-warning ml-2"></span> Ideia
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-surface border border-surface-lighter rounded-xl overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-surface-lighter">
          {dayNames.map(d => (
            <div key={d} className="p-3 text-center text-xs font-semibold text-text-secondary bg-surface-light">
              {d}
            </div>
          ))}
        </div>

        {/* Week 1 */}
        <div className="grid grid-cols-7">
          {days.slice(0, 7).map((day) => {
            const events = getEventsForDate(day);
            const today_ = isToday(day);
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[120px] p-2 border-r border-b border-surface-lighter last:border-r-0 ${
                  today_ ? 'bg-primary/5' : ''
                }`}
              >
                <span className={`text-xs font-medium ${
                  today_ ? 'bg-primary text-white px-1.5 py-0.5 rounded-full' : 'text-text-secondary'
                }`}>
                  {day.getDate()}
                </span>
                <div className="mt-1 space-y-1">
                  {events.map((ev, i) => (
                    <div
                      key={i}
                      className={`text-[10px] p-1.5 rounded border-l-2 ${statusColors[ev.status]}`}
                    >
                      <p className="font-medium text-text-primary truncate">{ev.title}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {ev.platform === 'Instagram' ? (
                          <Instagram size={8} className="text-instagram" />
                        ) : (
                          <Youtube size={8} className="text-youtube" />
                        )}
                        <span className="text-text-secondary">{ev.platform}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Week 2 */}
        <div className="grid grid-cols-7">
          {days.slice(7, 14).map((day) => {
            const events = getEventsForDate(day);
            return (
              <div
                key={day.toISOString()}
                className="min-h-[120px] p-2 border-r border-b border-surface-lighter last:border-r-0"
              >
                <span className="text-xs font-medium text-text-secondary">{day.getDate()}</span>
                <div className="mt-1 space-y-1">
                  {events.map((ev, i) => (
                    <div
                      key={i}
                      className={`text-[10px] p-1.5 rounded border-l-2 ${statusColors[ev.status]}`}
                    >
                      <p className="font-medium text-text-primary truncate">{ev.title}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {ev.platform === 'Instagram' ? (
                          <Instagram size={8} className="text-instagram" />
                        ) : (
                          <Youtube size={8} className="text-youtube" />
                        )}
                        <span className="text-text-secondary">{ev.platform}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* List View */}
      <div className="bg-surface border border-surface-lighter rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Lista de Conteudos Planejados</h3>
        <div className="space-y-2">
          {calendarEvents.map((ev, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-surface-light rounded-lg hover:bg-surface-lighter transition-colors">
              <div className={`w-1 h-10 rounded-full ${
                ev.status === 'today' ? 'bg-success' :
                ev.status === 'scheduled' ? 'bg-primary' : 'bg-warning'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{ev.title}</p>
                <p className="text-xs text-text-secondary">{ev.date}</p>
              </div>
              <div className="flex items-center gap-2">
                {ev.platform === 'Instagram' ? (
                  <Instagram size={14} className="text-instagram" />
                ) : (
                  <Youtube size={14} className="text-youtube" />
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  ev.status === 'today' ? 'bg-success/20 text-success' :
                  ev.status === 'scheduled' ? 'bg-primary/20 text-primary' :
                  'bg-warning/20 text-warning'
                }`}>{statusLabels[ev.status]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
