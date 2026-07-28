GUIA UNIFICADO DA REGULAÇÃO EM SAÚDE - V3 EM REVISÃO

Objetivo
--------
Portal técnico de apoio às solicitações reguladas presenciais, CORE/SISREG e DigSaúde MS do município de Eldorado/MS.

Estrutura principal
-------------------
- index.html: página principal do guia.
- protocolo/index.html: consulta às fontes técnicas.
- css/site.css: identidade visual, responsividade e impressão.
- js/app.js: carregamento, pesquisa, filtros, renderização, impressão e ajustes operacionais.
- protocolo.html: redirecionamento para a área de fontes.

Alterações desta revisão
------------------------
- Neuropediatria marcada como novamente disponível no DigSaúde MS.
- Nome padronizado como Neuropediatria, mantendo Neurologia Pediátrica e Neuroped como termos de pesquisa.
- Faixa etária de Neuropediatria definida até 16 anos, 11 meses e 29 dias.
- Inclusão da orientação sobre presença de familiar ou responsável no atendimento.
- Remoção de emojis da interface principal e da área de fontes técnicas.
- Substituição por ícones vetoriais SVG de aparência institucional.
- Identidade visual mais sóbria, adequada ao uso por profissionais da saúde.
- Separação inicial de HTML, CSS e JavaScript.
- Manutenção da pesquisa, filtros por via, categorias, modelos internos e impressão.
- Linguagem multiprofissional com uso de “profissional solicitante” quando aplicável.

Observação técnica
------------------
A base histórica dos protocolos continua sendo carregada do commit estável utilizado pela versão anterior. Os ajustes operacionais municipais são aplicados pelo arquivo js/app.js. A migração integral da base para arquivos de dados próprios poderá ser realizada em etapa posterior para eliminar essa dependência histórica.
