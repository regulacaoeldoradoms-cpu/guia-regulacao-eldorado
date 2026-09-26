# MISSÃO BANCÁRIA — STATUS

Atualizado em 26/09/2026 — Pagamentos/Consórcios e revisão cumulativa.

## Estado e autorização

**Fase ativa: Fase 1. Ensino por leitura antes da avaliação.** Wellyton autorizou continuar desenvolvimento, testes e integrações tecnicamente elegíveis sem acesso imediato e sem nova confirmação por etapa. Não confundir autorização com comprovação de compreensão ou homologação humana. Aplicar documentos 24 e 26: subdividir a produção, nunca omitir ensino.

Fonte oficial: `regulacaoeldoradoms-cpu/guia-regulacao-eldorado`.

## Decisões preservadas

`/estudos/`, `/api/studies/*`, acesso exclusivo de `wellyton` no backend. Conteúdo no GitHub e progresso em `study_*` no D1 `AUTH_DB`. Nenhum cargo novo, dado assistencial, segredo ou telemetria pedagógica externa. IDs, perguntas, gabaritos, XP e conquistas preservados. Bronze/Prata/Ouro permanecem segurança da conta. Rollback não apaga dados.

## Entregas incorporadas

- #488: documentação; Fase 0 aprovada em 25/09/2026, plano `15-FASE-0-PLANO-TECNICO.md`.
- #490 motor: `22257bca768cfc440578e0b8e11da62f15abc08f`.
- #495 expansão/revisões: `97cc6ab382d624841da46d6d9a9ff7f26a1a18ca`.
- #498 bloco/Chefe: `20487883c948dffbeb4b6849baa3c39e9c577d9f`.
- #499 retomada/Conquistas: `c5ebf3a0bb93bf303851835446ec32ff5decb0cd`.
- #500 sequência: `ac9128c7e807be8eff0ee5bc1579f792aa249a3d`.
- #501 ensino desenvolvido: `f6ae4c598156656e2c630372d6e2122259ffb1c2`.
- #502 leitor: `517c42a7511c2c72d01c242690fd32257b237ec3`.
- #503 aplicação introdutória: `c6c6dbfdd1e069053767bbec70ce2ce03b592dc3`.
- #504 CMN/BCB: `7a302b6f98fbde9b3ff5bc1aeca01bb8dad63378`.
- #505 Copom/CVM: `6040f0372997ca60bbf11502a94bd68e0cbad919`.
- **#506 Operadores/Seguros: `614991af8d01def824e85b1b71f06fbd22b01d4a`, incorporada nesta rodada.**

As 24 execuções de GitHub Actions da #506 foram consultadas com sucesso antes do merge do head `8ff043c4734e26fcae2d61ae55a55b4d00623028`, incluindo auditoria geral `36262664862` e navegador da Central `36262664850`. Nenhum gate, teste, baseline ou tolerância foi relaxado. Os checks de publicação do merge devem ser consultados separadamente; comentários finais das PRs registram resultados posteriores a este arquivo.

Main resultante: 21 atividades opcionais em sete aulas e as mesmas 38 questões pontuadas. Nove missões são somente o primeiro bloco de SFN, não o curso, o edital ou toda a disciplina. O ensino completo e os exemplos precedem a prática.

## Nova entrega — Pagamentos e preparação cumulativa

Documento: `35-APLICACAO-PAGAMENTOS-REVISAO-CUMULATIVA.md`.
Branch: `feat/missao-bancaria-aplicacao-pagamentos-revisao`, diretamente sobre a main após #506.

Seis atividades novas:
- Pagamentos: arranjo/prestador/infraestrutura, aplicativo versus pessoa jurídica, autofinanciamento versus custos e autorização.
- Preparação cumulativa: funções monetárias e operação com cliente, segmentos CVM/SUSEP/PREVIC, uso do Pix sem alterar a natureza do consórcio.

Nesta branch: **24 atividades nas oito aulas + três de revisão cumulativa = 27**, além das 38 questões pontuadas preservadas. Não há nota automática, XP por rascunho, novo mundo ou corte do material de ensino.

As referências de origem dos casos cumulativos cobrem as oito aulas anteriores e são validadas contra ordem e existência do texto. Os botões Reler abrem a síntese da preparação atual; referências de origem são metadados editoriais, não novos links automáticos entre missões.

Nenhuma alteração de interface produtiva, CSS, controlador, API, autenticação, D1, cronômetro ou pontuação. Fontes existentes apenas associadas às missões quando necessário. Textos, exemplos, IDs e perguntas mantidos.

## Validação inicial

Local: nove testes Node com fixtures e verificação de sintaxe aprovados. Hash do conteúdo testado confere com o blob enviado. Sem navegador local, suíte integral local ou acesso pessoal do usuário; DNS local do GitHub falhou.

CI preparado: testes do catálogo real e oito novos cenários de navegador, mantendo os 37 anteriores, total previsto de 45. Verificações específicas impedem confundir preenchimento da autoavaliação com respostas do Chefe/revisão. **Não presumir CI remoto, merge ou publicação desta nova entrega: consultar após o push.**

## Fontes e limites

Leis 12.865 e 11.795, LC 179, Lei 12.154 e páginas institucionais CVM/SUSEP foram lidas nos pontos usados. Descrições oficiais de SPI/Pix/Selic foram recuperadas na busca; algumas aberturas diretas do BCB dependem de JavaScript. A página de missão da PREVIC retornou erro; sua atribuição foi cotejada na Lei 12.154. Não alterar carimbos de fontes antigas nem alegar consolidação integral com base em trechos indexados. Detalhamento no documento 35.

## Próximo recorte autorizado

Concluir os testes/integração elegível e registrar publicação separadamente. Depois priorizar a confiabilidade de sessões, isolamento das rodadas e cronômetro, com testes comportamentais e preservação do histórico. Não pedir acesso imediato nem avançar automaticamente à Fase 2.

Pendências mantidas: recorde de sequência além de 500 eventos, interrupções e retomada de sessão, isolamento real das rodadas, persistência real e aprendizagem humana. O suplemento formativo não resolve essas lacunas. Rascunhos continuam temporários, conforme aviso da interface.

Histórico: “Rota não encontrada” motivou #492/#494; #493 sem merge; #491/#496/#497 substituídas. Falha de preview Worker não é sucesso nem evidência suficiente sobre produção. Merge, build, tráfego efetivo e homologação humana são estados distintos. A Fase 1 continua aberta.
