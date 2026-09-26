# MISSÃO BANCÁRIA — STATUS

Atualizado em: 26/09/2026

## Estado

**Fase ativa: Fase 1 — Motor MVP + primeiro recorte real de Sistema Financeiro Nacional.**

**Código das entregas abaixo incorporado à `main`; Fase 1 NÃO encerrada.** A homologação humana continua pendente. Incorporação no GitHub, publicação do frontend, publicação do Worker e uso autenticado são verificações distintas.

A documentação-base foi incorporada pela PR #488. A Fase 0 foi **aprovada e encerrada em 25/09/2026 por aceite explícito de Wellyton**. Plano aprovado: `15-FASE-0-PLANO-TECNICO.md`.

## Decisões técnicas homologadas

- frontend em `/estudos/` e APIs em `/api/studies/*`;
- acesso inicial exclusivamente para `wellyton`, com autorização no backend;
- nenhuma função profissional nova;
- D1 `AUTH_DB` com tabelas `study_*` isoladas;
- conteúdo pedagógico versionado no repositório; progresso no D1;
- IDs estáveis; preservação de tentativas, conclusões, XP, revisões e conquistas;
- medalhas de estudo integradas a `/conquistas/`, sem alterar Bronze/Prata/Ouro;
- nenhuma telemetria pedagógica externa;
- rollback sem apagar tabelas ou progresso;
- ensino por leitura e questões; entregas incrementais utilizáveis.

## Entregas incorporadas

### V1 — PR #490

Commit: `22257bca768cfc440578e0b8e11da62f15abc08f`.

Primeiras quatro missões: SFN, CMN, Banco Central e Copom; 12 questões autorais. Dashboard, XP, níveis, registro de sessões, modo foco, cronômetro, tentativas persistidas, agendamento de revisões e conquista `study.first_mission`.

Registro: `17-FASE-1-IMPLEMENTACAO-V1.md`.

### Expansão e revisão espaçada — PR #495

Commit: `97cc6ab382d624841da46d6d9a9ff7f26a1a18ca`.

Missões 5 e 6: CVM e operadores do SFN, com seis questões adicionais. Escopo do Mundo 1 fixado em nove missões e cálculo separado de disponibilidade, progresso conquistado e conclusão do conteúdo liberado.

Revisões de 1, 7 e 30 dias visíveis no dashboard quando vencem, botão **Revisar agora**, nova prática exigida após o vencimento, conclusão persistida e evento idempotente de +20 XP.

Registros:
- `18-EXPANSAO-SFN-V1.1.md`;
- `19-FASE-1-REVISAO-ESPACADA-V1.md`.

### Fechamento do primeiro bloco de SFN — PR #498

Commit: `20487883c948dffbeb4b6849baa3c39e9c577d9f`.

Missões 7 a 9:
- seguros, previdência e capitalização;
- pagamentos, Pix e consórcios;
- Chefe do SFN.

Total implementado: **9 missões e 38 questões autorais**. O Chefe possui 12 questões, nota mínima de 75%, 220 XP concedidos uma única vez e conquista `study.sfn.boss` — **SFN dominado**. A implementação calcula a nota a partir da sessão ativa e da última resposta de cada questão desde o início dessa sessão.

**9/9 representa somente este primeiro bloco de SFN, não o edital inteiro nem toda a disciplina Conhecimentos Bancários.**

Registro: `20-FECHAMENTO-MUNDO1-SFN.md`.

### Retomada parcial e Conquistas — PR #499

Commit: `c5ebf3a0bb93bf303851835446ec32ff5decb0cd`.

Aulas normais reconhecem IDs de questões respondidas anteriormente, permitindo continuar ou responder novamente. O bootstrap não entrega gabarito. Revisões e Chefe não reaproveitam respostas históricas na interface. Corrigida também a interpolação do SVG nos estados sem medalhas/indisponível de Conquistas, sem alterar os níveis de segurança da conta.

Registro: `21-FASE-1-RETOMADA-PARCIAL.md`.

### Sequência de estudo — PR #500

**Incorporada nesta retomada em 26/09/2026.**

Commit: `ac9128c7e807be8eff0ee5bc1579f792aa249a3d`.

Head validado antes do merge: `916963a53bf852d262c81ac73db97847121e80cc`.

Adicionado cartão de sequência atual e melhor sequência calculada. Dias agrupados em `America/Campo_Grande`; múltiplas atividades no mesmo dia contam uma vez; último estudo ontem mantém a sequência ativa durante o dia atual. Contam questões respondidas, sessões encerradas com pelo menos 60 segundos ou eventos pedagógicos persistidos. Abrir a página sem atividade não conta. A sequência não concede XP, não altera domínio nem remove conquistas.

Registro: `22-FASE-1-SEQUENCIA-ESTUDO-V1.md`.

## Validações confirmadas nesta retomada

No head da PR #500, **as 24 execuções de GitHub Actions retornaram `completed / success` antes do merge**, incluindo:
- Validar Missao Bancaria — run `36228357581`;
- Validar site — run `36228357641`;
- Validar interações do Portal V1 — run `36228357712`;
- Validar Camada Social V1 — run `36228357595`;
- Auditar modo escuro do Portal — run `36228357657`;
- suítes de autenticação, demais módulos e navegador da Central de Documentos.

A auditoria visual que estava pendente na sessão interrompida terminou com sucesso. Nenhum teste ou gate de deploy foi desabilitado nesta retomada. O código da PR foi incorporado no mesmo head validado; este registro posterior altera somente documentação.

## Publicação: evidência e limites

Na primeira abertura real de `/estudos/`, o frontend chegou antes do Worker e a API respondeu **“Rota não encontrada”**.

Correções anteriores incorporadas:
- PR #492 — atualização de compatibilidade do Wrangler;
- PR #494 — tratamento fail-closed de versão não produtiva com configuração equivalente;
- commit da recuperação: `90cc6d8e16039bb7ed1482bec3f75feadb860816`.

A PR #493 (`previews = { }`) foi fechada sem merge. As PRs antigas #491, #496 e #497 foram substituídas; não devem ser reincorporadas.

Evidência consultada na retomada da PR #500:
- preview do Cloudflare Pages no head `916963a`: publicação bem-sucedida;
- preview do Cloudflare Worker no mesmo head: **Build Failed**, sem causa detalhada confirmada nesta sessão;
- esse resultado de preview não comprova, sozinho, sucesso ou falha da publicação de produção;
- a consulta aos status combinados do novo merge não retornou registros de publicação;
- a tentativa de HTTP no ambiente de execução falhou na resolução DNS local; isso **não é evidência de indisponibilidade do portal**.

Portanto, **não registrar publicação produtiva nem fluxo autenticado como confirmados apenas porque houve merge**. Nenhuma credencial ou configuração produtiva foi alterada nesta retomada.

## Limitações e próxima correção técnica

A sequência V1 consulta somente os **500 eventos recentes**. Assim, o valor “Melhor” ainda pode perder a referência a períodos antigos quando o volume crescer; não deve ser interpretado como recorde histórico irrestrito. Priorizar agregação/persistência por dia antes de declarar essa métrica histórica definitiva, preservando os registros existentes.

O contador de tempo considera sessões registradas pelo mecanismo atual; ainda é necessário validar uso real, interrupções e retorno no celular. Testes técnicos não substituem evidência de retenção pedagógica.

## Homologação humana pendente

Wellyton já abriu a interface e autorizou a continuidade. Ainda não foi registrada confirmação explícita de todos os seguintes fluxos:

1. Concluir uma missão real.
2. Sair, recarregar e reencontrar progresso, respostas e XP.
3. Ver a conquista em `/conquistas/` sem duplicação.
4. Confirmar novas missões sem perda de histórico.
5. Fazer uma revisão real quando vencer e confirmar sua conclusão persistida.
6. Testar aprovação/reprovação do Chefe e a sequência de estudo no uso cotidiano.

O próximo passo é **confirmar publicação e esses fluxos, corrigir lacunas da Fase 1 e só então solicitar seu aceite final**. Não iniciar formalmente a Fase 2 nem declarar o curso completo sem novo registro de aprovação.
