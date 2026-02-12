# GenIA.lsp

<div align="center">

**Gerador de Código AutoLISP para AutoCAD com Inteligência Artificial**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

## 📋 Sobre o Projeto

GenIA.lsp é uma aplicação web moderna que utiliza inteligência artificial para gerar código AutoLISP compatível com AutoCAD, ZWCAD e BricsCAD. Descreva sua necessidade em português e receba código robusto, testado e pronto para uso.

### ✨ Características

- 🤖 **IA Avançada**: Utiliza Google Gemini para análise técnica e geração de código
- 🚀 **Performance Otimizada**: Uma única requisição gera análise e código completo
- 🔒 **Privacidade Total**: Sua chave API é armazenada localmente, sem servidores intermediários
- 💻 **Compatibilidade Universal**: Código LISP puro compatível com AutoCAD Windows/Mac, ZWCAD e BricsCAD
- 🎨 **Interface Moderna**: Design dark mode intuitivo e responsivo
- ⚡ **Processamento Rápido**: Geração instantânea de código após análise

## 🛠️ Tecnologias

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **IA**: Google Gemini API
- **Ícones**: Lucide React
- **Estilização**: Tailwind CSS

## 📦 Pré-requisitos

- Node.js 18+ instalado
- Chave API do Google Gemini ([Obter aqui](https://aistudio.google.com/app/apikey))

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd gaby-insuportal
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:3000
```

## 📖 Como Usar

1. **Configure sua API Key**: Na primeira execução, insira sua chave da API Google Gemini
2. **Descreva sua necessidade**: Digite em português o que você precisa automatizar no AutoCAD
3. **Analise o plano**: Revise a análise técnica gerada pela IA
4. **Gere o código**: Clique em "Gerar Código Final" para extrair o código limpo
5. **Baixe e use**: Faça o download do arquivo `.lsp` e carregue no AutoCAD

### Exemplo de Prompt

```
Faça uma rotina que selecione círculos e coloque o raio deles em um texto no centro.
```

## 🏗️ Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção

## 🔐 Segurança

- Sua chave API é armazenada apenas no navegador (localStorage)
- Nenhum dado é enviado para servidores externos além da API do Google
- Todas as requisições são feitas diretamente do seu navegador para a API do Gemini

## 📄 Licença

Este projeto é de uso pessoal e educacional.

## 👨‍💻 Desenvolvido com

Desenvolvido com foco em performance, privacidade e experiência do usuário.

---

<div align="center">
Feito com ❤️ para a comunidade de engenharia e arquitetura
</div>
