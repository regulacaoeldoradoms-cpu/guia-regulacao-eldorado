GUIA MÉDICO DE ENCAMINHAMENTOS REGULADOS - V3.1

Objetivo
--------
Portal destinado a médicos da Atenção Primária de Eldorado/MS para consulta de critérios clínicos, faixa etária, via de acesso, informações obrigatórias, exames e modelos de encaminhamento.

Público-alvo
------------
- Médicos da Atenção Primária.
- Profissionais médicos que elaboram solicitações reguladas pelo SISREG/CORE ou DigSaúde MS.

Estrutura principal
-------------------
- index.html: guia médico de encaminhamentos.
- protocolo/index.html: consulta às fontes técnicas transcritas.
- css/site.css: identidade visual geral, responsividade e impressão.
- css/medical.css: componentes específicos da interface médica.
- js/medical-app.js: pesquisa clínica, filtros, checklist, modelos, URLs individuais e impressão.
- js/app.js: aplicação da área de fontes técnicas.
- .github/workflows/validate-site.yml: validação automática do JavaScript e dos arquivos publicados.

Funcionalidades da versão 3.1
-----------------------------
- Linguagem e navegação direcionadas ao médico solicitante.
- Pesquisa por especialidade, exame, sintoma, diagnóstico e termos equivalentes.
- Resumo com faixa etária, via de acesso, profissional solicitante e vigência.
- Critérios para encaminhar apresentados antes dos requisitos documentais.
- Separação entre exames obrigatórios, condicionais e recomendados quando disponíveis.
- Checklist interativo antes do envio, sem armazenamento de dados do paciente.
- Botão para copiar checklist clínico.
- Botão para copiar modelo de encaminhamento.
- Alertas de situações que não devem aguardar fila ambulatorial.
- Fonte técnica, data de conferência e versão do guia em cada protocolo.
- Endereço individual por protocolo usando o parâmetro ?protocolo=ID.
- Neuropediatria disponível no DigSaúde MS, com faixa etária atualizada.
- Interface sem emojis, usando ícones vetoriais SVG.

Limites atuais
--------------
A base histórica ainda é carregada de um commit estável da versão anterior. Os ajustes operacionais municipais são aplicados no JavaScript. A próxima etapa estrutural recomendada é migrar todos os protocolos para arquivos de dados próprios e versionados.

Segurança e uso
---------------
O checklist não armazena nome, CPF, Cartão SUS, diagnóstico ou qualquer dado do paciente. O guia é apoio à elaboração do encaminhamento e não substitui avaliação clínica, classificação de risco ou análise regulatória.
