import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import GMNPage from './pages/GMNPage';
import InstagramAnalysis from './pages/InstagramAnalysis';
import YouTubeAnalysis from './pages/YouTubeAnalysis';
import TrafegoPagoPage from './pages/TrafegoPagoPage';
import AtendimentoIAPage from './pages/AtendimentoIAPage';
import WhatsAppPage from './pages/WhatsAppPage';
import ContentIdeas from './pages/ContentIdeas';
import ViralResearch from './pages/ViralResearch';
import CalendarPage from './pages/CalendarPage';
import SkillsPage from './pages/SkillsPage';
import RelatoriosPage from './pages/RelatoriosPage';
import ConnectionsPage from './pages/ConnectionsPage';

export default function App() {
  // Mobile: menu starts OPEN (user sees menu first)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Listen for resize to close mobile menu on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main className={`flex-1 md:ml-64 p-4 md:p-6 pt-16 md:pt-6 max-w-[1400px] transition-opacity duration-300 ${
        mobileMenuOpen ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'
      }`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gmn" element={<GMNPage />} />
          <Route path="/instagram" element={<InstagramAnalysis />} />
          <Route path="/youtube" element={<YouTubeAnalysis />} />
          <Route path="/trafego" element={<TrafegoPagoPage />} />
          <Route path="/atendimento" element={<AtendimentoIAPage />} />
          <Route path="/whatsapp" element={<WhatsAppPage />} />
          <Route path="/ideias" element={<ContentIdeas />} />
          <Route path="/viral" element={<ViralResearch />} />
          <Route path="/calendario" element={<CalendarPage />} />
          <Route path="/habilidades" element={<SkillsPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/conexoes" element={<ConnectionsPage />} />
        </Routes>
      </main>
    </div>
  );
}
