# MISSÃO BANCÁRIA — STATUS

Atualizado em: 26/09/2026, após a retomada da PR #500.

## Estado oficial

**Fase ativa: Fase 1 — Motor MVP + primeiro recorte real de Sistema Financeiro Nacional.**

**Entregas abaixo incorporadas à `main`; Fase 1 NÃO encerrada.** A homologação humana continua pendente. Merge, publicação do frontend, build do Worker, versão efetivamente servida e uso autenticado são verificações distintas.

A documentação-base entrou pela PR #488. A Fase 0 foi **aprovada e encerrada em 25/09/2026 por aceite explícito de Wellyton**; plano: `15-FASE-0-PLANO-TECNICO.md`.

Este STATUS prevalece sobre rótulos históricos como “em branch” nos registros anteriores, sem alterar as decisões aprovadas.

## Decisões preservadas

- `/estudos/` e `/api/studies/*`, acesso inicial exclusivo de `wellyton`, validado no backend;
- nenhum cargo profissional novo nem uso de dados assistenciais;
- D1 `AUTH_DB` somente com tabelas `study_*` para o domínio de estudos;
- conteúdo versionado no GitHub, progresso pessoal no D1 e IDs estáveis;
- preservação de tentativas, conclusões, XP, revisões e conquistas;
- integração com `/conquistas/`, sem alterar Bronze/Prata/Ouro da segurança;
- nenhuma telemetria pedagógica externa;
- rollback sem apagar tabelas ou progresso;
- ensino por leitura e questões; entregas incrementais utilizáveis.

## Entregas incorporadas

### V1 — PR #490

Commit: `22257bca768cfc440578e0b8e11da62f15abc08f`.

SFN, CMN, Banco Central e Copom; 12 questões autorais. Dashboard, XP, níveis, sessões, modo foco, cronômetro, tentativas persistidas, agendamento de revisões e conquista `study.first_mission`.

Registro: `17-FASE-1-IMPLEMENTACAO-V1.md`.

### Expansão e revisões — PR #495

Commit: `97cc6ab382d624841da46d6d9a9ff7f26a1a18ca`.

CVM e operadores do SFN, com seis questões adicionais. Mundo 1 fixado em nove missões; disponibilidade, progresso conquistado e conclusão do conteúdo liberado separados.

Revisões de 1/7/30 dias aparecem quando vencem. **Revisar agora** reutiliza o modo foco; conclusão exige prática após o vencimento e concede +20 XP por evento idempotente.

Registros: `18-EXPANSAO-SFN-V1.1.md` e `19-FASE-1-REVISAO-ESPACADA-V1.md`.

### Primeiro bloco de SFN — PR #498

Commit: `20487883c948dffbeb4b6849baa3c39e9c577d9f`.

Adicionadas seguros/previdência/capitalização, pagamentos/Pix/consórcios e Chefe do SFN. Total implementado: **9 missões e 38 questões autorais**.

O Chefe possui 12 questões, nota mínima de 75%, 220 XP uma única vez e conquista `study.sfn.boss` — **SFN dominado**. A implementação usa a sessão ativa e a última resposta de cada questão desde o início da sessão.

**9/9 refere-se apenas a este primeiro bloco de SFN: não significa edital inteiro, curso completo ou toda a disciplina Conhecimentos Bancários.**

Registro: `20-FECHAMENTO-MUNDO1-SFN.md`.

### Retomada parcial e Conquistas — PR #499

Commit: `c5ebf3a0bb93bf303851835446ec32ff5decb0cd`.

Aulas normais reconhecem IDs de questões respondidas anteriormente, permitindo continuar ou responder novamente. Bootstrap sem gabarito. Revisões e Chefe não reaproveitam respostas históricas na interface. Corrigido o SVG dos estados sem medalhas/indisponível em Conquistas.

Registro: `21-FASE-1-RETOMADA-PARCIAL.md`.

### Sequência de estudo — PR #500

**Incorporada nesta retomada em 26/09/2026.**

Commit: `ac9128c7e807be8eff0ee5bc1579f792aa249a3d`.

Head validado: `916963a53bf852d262c81ac73db97847121e80cc`.

Cartão com sequência atual e melhor sequência calculada. Dias agrupados em `America/Campo_Grande`; múltiplas atividades contam uma vez; estudo de ontem mantém a sequência ativa durante o dia atual. Contam questões, sessões encerradas com pelo menos 60 segundos ou eventos pedagógicos persistidos. Abrir a página sem atividade não conta. A sequência não concede XP, altera domínio ou remove conquistas.

Registro: `22-FASE-1-SEQUENCIA-ESTUDO-V1.md`.

## Validações desta retomada

Antes do merge da PR #500, **as 24 execuções de GitHub Actions retornaram `completed / success`**, incluindo:
- Missão Bancária: `36228357581`;
- site: `36228357641`;
- interações: `36228357712`;
- Camada Social: `36228357595`;
- auditoria visual: `36228357657`;
- autenticação, demais módulos e testes de navegador da Central.

A auditoria visual pendente terminou com sucesso. Nenhum teste ou gate foi desabilitado nesta retomada. O merge usou exatamente o head validado; os registros posteriores alteram apenas documentação.

## Publicação — evidência mais recente

Os check-runs do merge `ac9128c7e807be8eff0ee5bc1579f792aa249a3d` confirmaram:

- **Cloudflare Pages: success**, check `108407207253`, concluído às 12:48:47 UTC; publicação `6eb5c59e-2e6c-43ea-8784-2e8d00699a9e`;
- **GitHub Pages: deploy success**, job/check `108407233680`, workflow `36243087052`, concluído às 12:49:11 UTC;
- **Workers Builds: success**, check `108407276388`, concluído às 12:49:15 UTC; build `10a4ae63-68ab-44e4-ae9f-4e05f12a8fc5`, versão informada `b110fd9f-3cdf-4047-93a5-a147e9dcde47`.

Fonte verificável:
`https://api.github.com/repos/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/commits/ac9128c7e807be8eff0ee5bc1579f792aa249a3d/check-runs`

O preview do Worker no head anterior da PR havia falhado. Isso **não deve ser confundido com o build bem-sucedido da main após o merge**. O resumo do check do Worker informa URLs de preview; sozinho, não certifica qual versão está servindo 100% do tráfego produtivo.

A tentativa de HTTP no ambiente de execução falhou na resolução DNS local, sem provar indisponibilidade do portal. **Uso autenticado, persistência real e tráfego produtivo não foram verificados diretamente nesta sessão.** Nenhuma credencial ou configuração produtiva foi alterada.

## Histórico do incidente inicial

O frontend de `/estudos/` chegou antes do Worker e a API respondeu “Rota não encontrada”. Correções anteriores: PR #492, compatibilidade do Wrangler; PR #494, tratamento fail-closed de versão não produtiva equivalente. Commit: `90cc6d8e16039bb7ed1482bec3f75feadb860816`.

PR #493 (`previews = { }`) fechada sem merge. As PRs #491, #496 e #497 foram substituídas e não devem ser reincorporadas.

## Limitações e próximos ajustes técnicos

A sequência V1 consulta os **500 eventos recentes**. O valor “Melhor” não é ainda um recorde histórico irrestrito: períodos antigos podem sair dessa janela. Priorizar agregação/persistência por dia antes de declarar essa métrica histórica definitiva, sem apagar registros existentes.

O tempo usa o mecanismo atual de sessões; validar interrupções e retorno no celular. Testes técnicos não substituem comprovação de retenção pedagógica.

## Homologação humana pendente

Wellyton já abriu a interface e autorizou a continuidade, mas ainda falta confirmação explícita de:

1. Conclusão de missão real.
2. Saída, recarga e retorno com progresso, respostas e XP preservados.
3. Conquista visível em `/conquistas/`, sem duplicação.
4. Novas missões sem perda de histórico.
5. Revisão real concluída quando vencer.
6. Aprovação/reprovação do Chefe e sequência funcionando no cotidiano.

Próximo passo: **validar esses fluxos e corrigir lacunas da Fase 1 antes de solicitar seu aceite final**. Não iniciar formalmente a Fase 2 nem declarar curso completo sem registro de aprovação.
