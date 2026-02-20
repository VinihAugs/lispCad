
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Send, 
  Code2, 
  Download, 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Terminal,
  Layers,
  FileCode,
  Copy,
  Info,
  Key,
  ExternalLink,
  X
} from 'lucide-react';
import { Header, Footer } from './components/Layout';
import { AppStep, ErrorState } from './types';
import { analyzeRequest, extractCode, type AnalysisResult } from './services/geminiService';
import { HexagonBackground } from './components/HexagonBackground';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [apiKey, setApiKey] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [fullCodeResponse, setFullCodeResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('LISPGEN_API_KEY');
    if (savedKey) {
      setApiKey(savedKey);
      setIsConfigured(true);
    }
  }, []);

  const saveApiKey = (key: string) => {
    if (!key.trim()) return;
    localStorage.setItem('LISPGEN_API_KEY', key);
    setApiKey(key);
    setIsConfigured(true);
    setShowSettings(false);
  };

  const commandName = useMemo(() => {
    if (!generatedCode) return null;
    const commandMatch = generatedCode.match(/COMMAND:\s*(\w+)/i);
    if (commandMatch) return commandMatch[1].toUpperCase();
    const defunMatch = generatedCode.match(/defun\s+c:(\w+)/i);
    if (defunMatch) return defunMatch[1].toUpperCase();
    return "DESCONHECIDO";
  }, [generatedCode]);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    if (!apiKey.trim()) {
      setError({ message: 'Chave API não configurada. Configure nas configurações.', type: 'error' });
      return;
    }
    if (prompt.trim().length < 10) {
      setError({ message: 'Por favor, descreva melhor sua necessidade (mínimo 10 caracteres).', type: 'error' });
      return;
    }
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result: AnalysisResult = await analyzeRequest(prompt, apiKey);
      setAnalysis(result.analysis);
      setFullCodeResponse(result.code);
      setStep(AppStep.ANALYSIS);
    } catch (err: any) {
      setError({ message: err.message || 'Erro ao processar solicitação. Verifique sua chave API.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!fullCodeResponse.trim()) {
      setError({ message: 'Código não disponível. Execute a análise primeiro.', type: 'error' });
      return;
    }
    
    const cleanCode = extractCode(fullCodeResponse);
    
    if (!cleanCode || cleanCode.trim().length === 0) {
      setError({ message: 'Não foi possível extrair o código. Tente fazer uma nova análise.', type: 'error' });
      return;
    }
    
    setGeneratedCode(cleanCode);
    setStep(AppStep.FINISHED);
  };

  const downloadLispFile = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${commandName || 'GenIA'}.lsp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setPrompt('');
    setAnalysis('');
    setGeneratedCode('');
    setFullCodeResponse('');
    setStep(AppStep.INPUT);
    setError(null);
  };

  if (!isConfigured) {
    return (
      <HexagonBackground>
        <div className="min-h-screen text-slate-200 flex items-center justify-center p-4 pointer-events-none">
          <div className="pointer-events-auto max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center border border-cyan-500/30">
              <Key className="w-8 h-8 text-cyan-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Configuração GenIA.lsp</h1>
            <p className="text-slate-400 text-sm">
              Para garantir total independência e privacidade, insira sua própria chave da API Google Gemini.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Chave API Gemini</label>
              <input 
                type="password"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-slate-700 font-mono"
                placeholder="Insira sua chave aqui..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors py-2 bg-cyan-500/5 rounded-lg border border-cyan-500/10"
            >
              Não tenho uma chave <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button 
            disabled={!apiKey.trim()}
            onClick={() => saveApiKey(apiKey)}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-900 font-bold rounded-2xl transition-all shadow-xl shadow-cyan-500/20"
          >
            Começar a Automatizar
          </button>
        </div>
        </div>
      </HexagonBackground>
    );
  }

  return (
    <HexagonBackground>
      <div className="min-h-screen flex flex-col text-slate-200 font-sans pointer-events-none">
        <div className="pointer-events-auto">
          <Header onOpenSettings={() => setShowSettings(true)} />
        </div>
      
      {showSettings && (
        <div className="pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 relative shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <Key className="w-6 h-6 text-cyan-500" />
              <h2 className="text-xl font-bold text-white">Configurações de API</h2>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-slate-400 leading-relaxed">
                Você pode alterar sua chave API a qualquer momento. Suas requisições são feitas diretamente para o Google.
              </p>
              <input 
                type="password"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all font-mono"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button 
                onClick={() => saveApiKey(apiKey)}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="pointer-events-none flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="pointer-events-auto flex items-center justify-between mb-12 px-4 max-w-md mx-auto">
          {[AppStep.INPUT, AppStep.ANALYSIS, AppStep.FINISHED].map((s, idx) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step === s || (idx === 0 && step !== AppStep.INPUT) || (idx === 1 && step === AppStep.FINISHED)
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' 
                    : 'border-slate-800 bg-slate-900 text-slate-600'
                }`}>
                  {idx === 0 && <Terminal className="w-5 h-5" />}
                  {idx === 1 && <Layers className="w-5 h-5" />}
                  {idx === 2 && <FileCode className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-bold ${
                  step === s ? 'text-cyan-500' : 'text-slate-600'
                }`}>
                  {idx === 0 ? 'Prompt' : idx === 1 ? 'Análise' : 'Código'}
                </span>
              </div>
              {idx < 2 && <div className={`h-[2px] flex-1 mx-2 transition-colors duration-300 ${
                (idx === 0 && (step === AppStep.ANALYSIS || step === AppStep.FINISHED)) || (idx === 1 && step === AppStep.FINISHED)
                  ? 'bg-cyan-500' : 'bg-slate-800'
              }`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="pointer-events-none space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {error && (
            <div className="pointer-events-auto p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Erro no Processamento</p>
                <p className="text-sm opacity-90">{error.message}</p>
                <button onClick={() => setShowSettings(true)} className="text-xs underline mt-2 hover:text-white transition-colors">Abrir Configurações de API</button>
              </div>
            </div>
          )}

          {step === AppStep.INPUT && (
            <div className="pointer-events-none space-y-6">
              <div className="text-center space-y-2 pointer-events-none">
                <h2 className="text-3xl font-bold text-white">Automação AutoCAD</h2>
                <p className="text-slate-400">Descreva sua necessidade em português. O GenIA.lsp criará um script compatível e funcional.</p>
              </div>
              <div className="relative group pointer-events-auto">
                <textarea
                  className="w-full h-40 p-6 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-lg resize-none shadow-xl"
                  placeholder="Ex: Uma rotina que selecione círculos e coloque o raio deles em um texto no centro."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  maxLength={2000}
                />
                <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
                  <div className="flex items-center gap-3">
                    {prompt.trim().length > 0 && (
                      <span className={`text-xs font-mono ${
                        prompt.trim().length < 10 
                          ? 'text-amber-500' 
                          : prompt.trim().length >= 10 
                          ? 'text-slate-500' 
                          : ''
                      }`}>
                        {prompt.trim().length}/2000
                      </span>
                    )}
                    <button
                      disabled={!prompt.trim() || isLoading || !apiKey.trim() || prompt.trim().length < 10}
                      onClick={handleAnalyze}
                      className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-900 font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
                      title={!apiKey.trim() ? 'Configure a chave API primeiro' : prompt.trim().length < 10 ? 'Descreva melhor sua necessidade (mín. 10 caracteres)' : ''}
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Analisar Projeto</>}
                    </button>
                  </div>
                  {prompt.trim().length > 0 && prompt.trim().length < 10 && (
                    <span className="text-xs text-amber-500">Mínimo 10 caracteres para análise</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === AppStep.ANALYSIS && (
            <div className="pointer-events-auto space-y-6 animate-in zoom-in-95 duration-300">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-slate-800/50 px-6 py-4 flex items-center justify-between border-b border-slate-700">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold uppercase text-xs tracking-widest">
                    <Layers className="w-4 h-4" />
                    Plano de Implementação (Pure LISP)
                  </div>
                </div>
                <div className="p-8 prose prose-invert max-w-none">
                  <div className="whitespace-pre-line leading-relaxed text-slate-300 text-sm sm:text-base">
                    {analysis}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setStep(AppStep.INPUT)} className="px-8 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors">Ajustar Pedido</button>
                <button 
                  onClick={handleGenerate} 
                  disabled={!fullCodeResponse.trim()} 
                  className="px-10 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-900 font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                  title={!fullCodeResponse.trim() ? 'Execute a análise primeiro' : 'Extrair código já gerado'}
                >
                  <><Code2 className="w-5 h-5" /> Gerar Código Final</>
                </button>
              </div>
            </div>
          )}

          {step === AppStep.FINISHED && (
            <div className="pointer-events-auto space-y-6 animate-in zoom-in-95 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="bg-slate-800/50 px-6 py-3 flex items-center justify-between border-b border-slate-700">
                    <span className="text-cyan-400 font-mono text-sm uppercase tracking-tighter">source_code.lsp</span>
                    <button onClick={copyToClipboard} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                      {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <pre className="p-6 font-mono text-[10px] sm:text-xs overflow-x-auto bg-slate-950/50 max-h-[450px] text-cyan-100/70 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
                    <code>{generatedCode}</code>
                  </pre>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Info className="w-5 h-5" />
                      Instruções
                    </div>
                    <div className="space-y-4 text-xs sm:text-sm">
                      <div className="space-y-2">
                        <p className="text-slate-400 font-medium">1. Baixe o arquivo</p>
                        <p className="text-slate-500 text-[10px] leading-tight">O arquivo será salvo com a extensão .lsp para reconhecimento imediato pelo AutoCAD.</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-slate-400 font-medium">2. Carregue no CAD</p>
                        <p className="text-slate-500 text-[10px] leading-tight">Use o comando <b>APPLOAD</b> ou arraste o arquivo para o desenho.</p>
                      </div>
                      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
                        <p className="text-[10px] uppercase text-slate-500 tracking-widest font-bold">Comando de Execução</p>
                        <p className="text-2xl font-black text-cyan-500 font-mono tracking-tighter">{commandName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button onClick={downloadLispFile} className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-2xl transition-all shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 text-lg group">
                    <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" /> Baixar Script
                  </button>
                  <button onClick={reset} className="w-full py-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-colors text-sm font-semibold">Nova Automação</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

        <div className="pointer-events-auto">
          <Footer />
        </div>
      </div>
    </HexagonBackground>
  );
};

export default App;
