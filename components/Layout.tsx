
import React from 'react';
import { LaptopMinimalCheck, Github, Settings, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => (
  <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-cyan-500 rounded-lg">
          <LaptopMinimalCheck className="w-6 h-6 text-slate-900" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Gen<span className="text-cyan-500">IA.lsp</span>
        </h1>
      </div>
      <nav className="flex items-center gap-4 sm:gap-6">
        <button 
          onClick={onOpenSettings}
          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-full transition-all"
          title="Configurações"
        >
          <Settings className="w-5 h-5" />
        </button>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors hidden sm:block">
          <Github className="w-5 h-5" />
        </a>
      </nav>
    </div>
  </header>
);

export const Footer: React.FC = () => (
  <footer className="border-t border-slate-800 py-8 bg-slate-950 mt-auto">
    <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-slate-500 text-sm">
        © {new Date().getFullYear()} GenIA.lsp. Desenvolvido por{' '}
        <a 
          href="https://www.linkedin.com/in/viniciusaugusto3006/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
        >
          Vinicius Augusto
          <ExternalLink className="w-3 h-3" />
        </a>
        {' '}para engenharia e arquitetura de precisão.
      </p>
      <div className="flex gap-4 text-xs text-slate-600 font-mono">
        <span>STABLE v1.1.0</span>
        <span>|</span>
        <span>BYOK MODE</span>
      </div>
    </div>
  </footer>
);
