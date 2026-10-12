# Modal de manifestação no celular

Ajuste de apresentação do formulário original aberto por “Escrever ao Conselho” em `/cidadao/`, somente na apresentação móvel do cidadão (até 900 px). O formulário, campos, tipos, escolhas de privacidade, consentimento, anexos e handlers de envio permanecem os mesmos.

O painel acompanha a altura e deslocamento do visual viewport, com uma única área de rolagem. Cabeçalho, etapas, ícones e espaçamentos menores liberam espaço; controles e ações mantêm alvos de 48 px. Radios nativos ficam visíveis e operáveis. Desktop e impressão ficam fora das regras de apresentação.

Em fixture de 390 px, a altura do formulário caiu de 4204,83 para 3215,48 px; a área do painel fica dentro de uma viewport reduzida a 400 px. Essa comparação mede geometria local sintética, sem alegar desempenho de dispositivo real.

## Verificação

- 12 cenários: 320, 360 e 390 px, temas claro/escuro, texto 100%/200%.
- Validação obrigatória, quatro tipos, duas escolhas de privacidade, arquivo rejeitado e PDF sintético aceito.
- Rascunho e anexo preservados ao fechar, cancelar, retornar pela navegação e receber erro de envio; sucesso e upload apenas em endpoints interceptados.
- Comparações existentes de Cidadão: quatro cenários light/screen e dark/print preservados contra `977b76f618ccd2cc2ba5ec7bfb266404dff1c28a`, sem mudar baseline ou tolerância.
- Teste reproduzível: `node testing/citizen-layout/citizen-compose-mobile.mjs`; evidências em `.local/citizen-compose-evidence/` (ignoradas no git e coletadas no CI).

A imagem de referência da Library não foi visualizada: duas materializações suportadas falharam. A implementação foi avaliada com o formulário real em fixture sintética; não se afirma correspondência visual à imagem indisponível.

Folha plenamente escopada permanece ativa no shell para evitar regressão ao voltar à rota. URLs dos entrypoints foram versionadas para publicar o código novo em conjunto; nenhuma política global de cache foi alterada.
