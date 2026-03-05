# Ignotec - Resumo do Desenvolvimento

Este arquivo serve como um ponto de controle para o estado atual do projeto Ignotec, permitindo que futuras sessões comecem com todo o contexto necessário.

## 🚀 O que foi feito até agora

### 1. Replicaçao de Estilo e Identidade Visual
- O frontend foi totalmente ajustado para replicar exatamente o site original `ignotec.com.br`.
- **Elementos Corrigidos**: Logo de chama nas variadas cores (SVG puro), fontes, espaçamentos, rótulos de seção (ex: `// sobre`), indicadores de processo e cards de serviço.
- **Animações**: Implementado o efeito de "reveal-on-scroll" (surgir ao rolar a página).

### 2. Infraestrutura Backend (Node.js + SQLite)
- Implementado um servidor Express robusto no diretório `/server`.
- **Banco de Dados**: Usado `sql.js` (SQLite via WASM) para garantir portabilidade total, salvando o arquivo `ignotec.db` no disco.
- **Autenticação**: Sistema de login admin único usando JWT (JSON Web Tokens) e `bcryptjs` para hashing de senhas.
- **Upload de Imagens**: Integrado `multer` para permitir upload de imagens de capa para Posts e imagens de destaque para Projetos.

### 3. Funcionalidades Avançadas de Projeto
- **Campos Internos**: Adicionado suporte para campos de gestão interna (`publico_alvo`, `dinamica`, `motivacoes`, `notas`, `cliente`, `prazo`) que não aparecem no site público.
- **Sistema de Templates**: Criado o arquivo `server/templates/project-template.txt` para ser enviado a LLMs. O backend suporta a importação desses projetos via JSON.
- **Migração do Frontend**: Todo o frontend agora consome a API real em vez de `localStorage`.

### 4. Conteinerização (Docker & EasyPanel)
- Criado `Dockerfile` (multi-stage build) que compila o React e serve via Node.js.
- Criado `docker-compose.yml` com volumes persistentes para dados e uploads.
- Configuração pronta para deploy no EasyPanel/VPS.

## 🛠 Estado Atual e Próximos Passos

### Bugs Conhecidos
- **Portfolio Público**: Identificado que os projetos marcados como "visíveis" as vezes não renderizam no portfolio da HomePage, apesar de estarem no banco de dados e aparecerem no Admin. (Causa provável: lógica de filtragem no `DataContext`).

### Próximos Passos Imediatos
1. **Corrigir Renderização do Portfolio**: Ajustar o `getVisibleProjects` no `DataContext` ou o fetch na `HomePage` para garantir que os dados públicos carreguem corretamente.
2. **Teste de Persistência**: Subir o container localmente com volumes e verificar se ao reiniciar, os dados e imagens permanecem lá.
3. **Refinamento de UX**: Adicionar feedbacks visuais (spinners de carregamento) durante os uploads de arquivos pesados.

---
**Data do Último Update**: 02 de Março de 2026
**Responsável**: Antigravity AI
