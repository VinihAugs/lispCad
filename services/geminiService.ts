
import { GoogleGenAI } from "@google/genai";

export interface AnalysisResult {
  analysis: string;
  code: string;
}

const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'models/gemini-1.5-flash',
  'models/gemini-1.5-pro',
  'models/gemini-pro',
];

const processResponse = (fullText: string): AnalysisResult => {
  if (!fullText || fullText.trim().length === 0) {
    throw new Error('A API retornou uma resposta vazia. Tente novamente.');
  }
  
  const analysisMatch = fullText.match(/=== ANÁLISE ===\s*([\s\S]*?)(?=\s*=== CÓDIGO ===|$)/i);
  const codeMatch = fullText.match(/=== CÓDIGO ===\s*([\s\S]*?)$/i);
  
  let analysis = analysisMatch ? analysisMatch[1].trim() : '';
  let code = codeMatch ? codeMatch[1].trim() : '';
  
  if (!analysis || !code) {
    const codeBlockMatch = fullText.match(/```(?:lisp|autolisp)?\s*([\s\S]*?)```/i);
    if (codeBlockMatch) {
      code = codeBlockMatch[1].trim();
      analysis = fullText.replace(/```[\s\S]*?```/g, '').trim();
    } else {
      const lines = fullText.split('\n');
      let codeStartIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('(defun') || lines[i].trim().startsWith(';;;')) {
          codeStartIndex = i;
          break;
        }
      }
      if (codeStartIndex > 0) {
        analysis = lines.slice(0, codeStartIndex).join('\n').trim();
        code = lines.slice(codeStartIndex).join('\n').trim();
      } else {
        analysis = fullText;
        code = '';
      }
    }
  }
  
  analysis = analysis
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^[-*+]\s+/gm, '• ')
    .replace(/^>\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .trim();
  
  code = code
    .replace(/```lisp/g, "")
    .replace(/```autolisp/g, "")
    .replace(/```/g, "")
    .trim();
  
  return { analysis, code };
};

export const analyzeRequest = async (prompt: string, apiKey: string): Promise<AnalysisResult> => {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Chave API não fornecida');
  }
  if (!prompt || !prompt.trim()) {
    throw new Error('Prompt não fornecido');
  }
  if (prompt.trim().length < 10) {
    throw new Error('Prompt muito curto. Forneça mais detalhes.');
  }
  
  const client = new GoogleGenAI({ apiKey });
  const promptText = `Necessidade: "${prompt}"

Primeiro, forneça uma análise técnica resumida (máximo 300 palavras) com:
- Estratégia de implementação
- Códigos DXF necessários (ex: 10, 11, 40)
- Fluxo lógico principal

Use texto puro, sem markdown. Organize com números e letras (1., 2., a), b), etc.).

Depois, forneça o código AutoLISP completo seguindo:

Requisitos de compatibilidade:
1. Use LISP puro. Evite funções 'vla-' ou 'vlax-' (ActiveX) para funcionar no AutoCAD Mac, ZWCAD e BricsCAD.
2. Para UNDO, use (command "_.UNDO" "_BEGIN") no início e (command "_.UNDO" "_END") no fim e no tratamento de erro.
3. Para criar ou modificar entidades, prefira 'entmake' ou 'command'.
4. Adicione cabeçalho: ;;; COMMAND: NOME_DO_COMANDO.
5. Localize todas as variáveis no (defun C:NOME (/ var1 var2 ...)).
6. Tratamento de erro via (defun *error* (msg) ...).

Formato:
Comece com "=== ANÁLISE ===" seguida da análise.
Depois "=== CÓDIGO ===" seguido do código AutoLISP completo.
Código pronto para uso, sem blocos de markdown.`;

  const config = {
    systemInstruction: "Especialista em AutoLISP para AutoCAD. Gere análises técnicas objetivas e código LISP puro compatível com Windows, Mac, ZWCAD e BricsCAD.",
    temperature: 0.5,
  };

  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    try {
      const response = await client.models.generateContent({
        model: model,
        contents: promptText,
        config: config,
      });

      const fullText = response.text || "";
      return processResponse(fullText);
    } catch (error: any) {
      lastError = error;
      if (error.message?.includes('API key') || error.message?.includes('quota') || error.message?.includes('rate limit')) {
        throw error;
      }
      continue;
    }
  }

  if (lastError) {
    if (lastError.message?.includes('API key')) {
      throw new Error('Chave API inválida ou expirada. Verifique suas configurações.');
    }
    if (lastError.message?.includes('quota') || lastError.message?.includes('rate limit')) {
      throw new Error('Limite de cota excedido. Aguarde alguns minutos ou verifique sua conta.');
    }
    throw new Error(`Nenhum modelo disponível. Erro: ${lastError.message || 'Erro desconhecido'}`);
  }

  throw new Error('Não foi possível conectar à API. Verifique sua conexão e tente novamente.');
};

export const extractCode = (code: string): string => {
  if (!code || !code.trim()) {
    return '';
  }
  
  let cleanCode = code
    .replace(/```lisp/g, "")
    .replace(/```autolisp/g, "")
      .replace(/```/g, "")
      .trim();
  
  const codeStartMarkers = [
    /^;;; COMMAND:/m,
    /^\(defun\s+c:/m,
    /^\(defun\s+C:/m,
  ];
  
  for (const marker of codeStartMarkers) {
    const match = cleanCode.match(marker);
    if (match && match.index !== undefined) {
      cleanCode = cleanCode.substring(match.index).trim();
      break;
    }
  }
  
  return cleanCode;
};
