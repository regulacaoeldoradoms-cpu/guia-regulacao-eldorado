# MISSÃO BANCÁRIA — FASE 1 — IMPLEMENTAÇÃO V1

Data: 25/09/2026  
Estado: **IMPLEMENTAÇÃO EM BRANCH; HOMOLOGAÇÃO HUMANA PENDENTE**

Branch:
`feat/missao-bancaria-fase1-mvp`

## Fatia vertical construída

Primeiro recorte real:
1. Sistema Financeiro Nacional — visão geral;
2. Conselho Monetário Nacional;
3. Banco Central do Brasil;
4. Copom.

Total inicial:
- 4 missões;
- 12 questões autorais;
- recordação ativa;
- fontes oficiais por missão;
- XP;
- cronômetro;
- progresso persistente;
- revisão agendada em 1, 7 e 30 dias;
- conquista `study.first_mission`.

## Backend

Novo módulo:
`worker/studies.js`

Namespace:
`/api/studies/*`

Gate:
`username === 'wellyton'`

Persistência:
- `study_profiles`;
- `study_topic_progress`;
- `study_sessions`;
- `study_attempts`;
- `study_reviews`;
- `study_xp_events`;
- `study_achievements`.

XP e conquistas possuem proteção idempotente.

## Conteúdo

Arquivos:
- `worker/studies-content/manifest.js`;
- `worker/studies-content/banking-sfn.js`.

Snapshot de fontes:
`16-FONTES-SFN-V1.md`

O gabarito permanece no backend. O bootstrap enviado ao navegador remove resposta e explicação da questão; a explicação é devolvida somente após a tentativa.

## Frontend

- `/estudos/`;
- `js/studies.js`;
- `css/studies.css`.

Recursos:
- dashboard;
- nível/XP;
- questões/acertos;
- horas líquidas;
- campanha disponível;
- progresso pessoal;
- mapa de missões;
- desbloqueio sequencial;
- modo foco;
- cronômetro;
- recordação ativa;
- minibatalha;
- conclusão;
- celebração de conquista.

## Integrações mínimas

- card Missão Bancária em Home/Ferramentas somente para `wellyton`;
- roteamento no Worker;
- categoria Missão Bancária em `/conquistas/`;
- Bronze/Prata/Ouro preservados.

## Segurança

- 401 sem sessão;
- 403 para sessão válida de outra conta;
- nenhuma função profissional nova;
- sem Firebase/Drive/Telemedicina;
- sem telemetria pedagógica externa;
- CSP própria na página;
- dados de estudo no D1 `AUTH_DB` somente em tabelas `study_*`.

## Testes

Adicionados:
- `worker/tests/studies.test.mjs`;
- `.github/workflows/validate-missao-bancaria.yml`.

O workflow dedicado valida:
- suíte do Worker;
- sintaxe;
- arquivos;
- gate exclusivo;
- integração com conquistas;
- isolamento de termos/domínios institucionais;
- documentação/fontes.

## Estado de publicação

Ainda **não homologado por Wellyton**.
Não considerar a Fase 1 encerrada.

Próximas etapas:
1. abrir PR da Fase 1;
2. conferir CI;
3. disponibilizar ambiente de homologação conforme pipeline do Portal;
4. Wellyton estudar/testar a primeira missão real;
5. corrigir UX/metodologia;
6. provar expansão sem perda de progresso antes do aceite final da Fase 1.
