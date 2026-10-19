# Guia Médico — apresentação enxuta dos recortes clínicos

Data: 19/10/2026.

## Decisão de produto

Retirar do Guia Médico, da Recepção e da impressão dos recortes clínicos estruturados o bloco de leitura pública **“Fonte, detalhes e pendências”** e a seção anexa de **“Notas de fonte e pontos em aberto”**. O responsável avaliou que a exibição de notas editoriais e pendências de auditoria no fluxo principal polui o Guia e pode induzir o leitor a confundir curadoria técnica com requisitos assistenciais.

O Guia Médico permanece **operacional, não enciclopédico**: o foco é apresentar critérios por condição, dados que devem constar no encaminhamento, exames e documentos diferenciados por obrigatoriedade/condição/disponibilidade, avisos de faixa etária e limites clínicos pertinentes. Mantêm-se o botão **“Imprimir este recorte”** e a referência direta ao protocolo utilizado (nome/versão/páginas).

## Integridade, transparência e segurança preservadas

- Não apagar dos arquivos `data/clinical-conditions/*.json` os metadados de fonte, páginas, verificações, pontos pendentes ou status de revisão. São necessários para auditoria, revisões e integração segura com a IA.
- Não promover incertezas em novas obrigações clínicas nem tratar oferta, pactuação ou vigência institucional não verificadas como confirmação.
- Avisos assistenciais e limites pertinentes a perguntas específicas continuam a aparecer no fluxo contextual; ausência de definição na fonte não vira regra clínica.
- O componente comum `js/clinical-condition-pilot.js` não injeta o painel de notas na apresentação, na Recepção nem no HTML de impressão. A linha de referência ao protocolo permanece.
- Os testes garantem que regras completas e fontes ainda são entregues ao Worker, sem transmitir dados pessoais, e que o HTML público não contém a seção editorial removida.
- Esta mudança é somente de apresentação. Não revisa critérios médicos, não confirma vigência ou oferta e não altera os sistemas CORE/SISREG/DigSaúde.

## Critério de aceitação

Sem a seção removida em desktop, mobile e impressão; sem quebra de layout ou referência; mesma quantidade de regras visíveis, mesmo conteúdo clínico, fluxo de IA e marcações de conferência. Executar checks do repositório e conferir publicação antes de encerrar.
