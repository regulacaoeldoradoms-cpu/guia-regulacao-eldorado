GUIA MÉDICO DE ENCAMINHAMENTOS REGULADOS

Objetivo
--------
Portal destinado a médicos da Atenção Primária de Eldorado/MS para consulta de critérios clínicos, faixa etária, via de acesso, informações obrigatórias, exames e alertas dos protocolos regulados.

Público-alvo
------------
- Médicos da Atenção Primária.
- Profissionais médicos que elaboram solicitações reguladas pelo SISREG/CORE ou DigSaúde MS.

Estrutura principal
-------------------
- index.html: guia médico de encaminhamentos.
- protocolo/index.html: consulta às fontes técnicas transcritas.
- css/site.css: identidade visual geral e responsividade.
- css/medical.css: componentes específicos da interface médica.
- css/institutional-print.css: documento institucional para orientação ao paciente.
- css/ai-assistant.css: botão flutuante e janela do assistente dos protocolos.
- js/medical-app.js: pesquisa clínica, filtros, checklist e protocolos.
- js/dermatology-status.js: ajuste operacional temporário da Dermatologia.
- js/learning-mode.js: modo de aprendizagem sem modelos para copiar.
- js/institutional-print.js: impressão institucional para apresentação ao médico.
- js/ai-config.js: endereço do backend do assistente.
- js/ai-assistant.js: conversa, busca contextual, bloqueio de identificadores e modo local.
- worker/gemini-assistant.js: proxy seguro para a API Gemini.
- CONFIGURAR-ASSISTENTE-GEMINI.md: instruções para ativação gratuita do Gemini.
- .github/workflows/validate-site.yml: validação automática do JavaScript e dos arquivos publicados.

Funcionalidades atuais
----------------------
- Linguagem e navegação direcionadas ao médico solicitante.
- Pesquisa por especialidade, exame, sintoma, diagnóstico e termos equivalentes.
- Resumo com faixa etária, via de acesso, profissional solicitante e vigência.
- Critérios para encaminhar apresentados antes dos requisitos documentais.
- Separação entre exames obrigatórios, condicionais e recomendados quando disponíveis.
- Checklist interativo durante o preenchimento, sem armazenamento de dados do paciente.
- Sem modelo pronto ou função de copiar encaminhamento.
- Alertas de situações que não devem aguardar fila ambulatorial.
- Fonte técnica e data de conferência em cada protocolo.
- Endereço individual por protocolo usando o parâmetro ?protocolo=ID.
- Documento institucional de orientação ao paciente, com imagem institucional.
- Assistente flutuante para perguntas sobre protocolos.
- Modo de consulta local disponível mesmo antes da conexão com o Gemini.
- Backend Gemini preparado para Cloudflare Workers, com chave protegida e origem restrita.
- Dermatologia marcada como indisponível temporariamente no teleatendimento.
- Neuropediatria disponível no DigSaúde MS, com faixa etária atualizada.
- Interface sem emojis, usando ícones vetoriais SVG.

Limites atuais
--------------
A base histórica ainda é carregada de um commit estável da versão anterior. Os ajustes operacionais municipais são aplicados no JavaScript. A próxima etapa estrutural recomendada é migrar todos os protocolos para arquivos de dados próprios e versionados.

O Gemini só será ativado após a publicação do Worker e o preenchimento do endereço em js/ai-config.js. Enquanto isso, o assistente responde em modo local com os dados estruturados do próprio site.

Segurança e uso
---------------
O checklist e o chat não mantêm dados após o fechamento da página. O assistente bloqueia identificadores pessoais comuns e orienta o uso de perguntas gerais ou casos anonimizados. O guia é apoio à elaboração do encaminhamento e não substitui avaliação clínica, classificação de risco ou análise regulatória.
