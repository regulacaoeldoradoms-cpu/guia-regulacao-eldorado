# Delta do Dossiê Mestre — Camada Social V1

Data de corte: 11/09/2026.

Este arquivo registra mudanças posteriores ao PDF “00 - DOSSIÊ MESTRE DO Portal
Regulação Eldorado-MS - V1 - 2026-08”. O PDF é uma fotografia de 31/08/2026 e não
está versionado neste repositório. Em conflito, o código atual e as decisões
permanentes mais recentes prevalecem.

## Divergências históricas resolvidas

- A Camada Social deixou de ser futura: backend, perfil, amizade, feed textual,
  notificações, descoberta, moderação e navegação foram implementados.
- A raiz pode apresentar a Home social por feature flag; `/ferramentas/` preserva o
  catálogo de trabalho e o fallback.
- Técnico em Telemedicina integra o chat profissional conforme o código e
  `docs/CHAT-PROFISSIONAL.md` atuais.
- Cidadão Bronze escolhe, por manifestação, entre envio anônimo e identificado; o
  fallback continua anônimo. A implantação social não alterou essa regra.
- O repositório estava público na verificação de 06/09/2026, embora o snapshot do
  Dossiê o descrevesse como privado.
- Notificações sociais usam `social_notifications`; avisos institucionais do Canal do
  Cidadão permanecem em `portal_notifications` e não são misturados.

## Novo mapa de rotas

- `/ferramentas/` — catálogo de módulos autorizados;
- `/perfil/?u=handle` — perfil social autenticado;
- `/amigos/` — relações e descoberta;
- `/notificacoes/` — avisos sociais;
- `/admin/social/` — moderação exclusiva do Desenvolvedor.

## Novo mapa de persistência

O D1 passa a conter tabelas `social_*` aditivas e separadas: identidade UUID,
aliases de handle, relações, posts, comentários, reações, notificações, denúncias,
auditoria, rate limits e versões de migração. Firestore/Storage continuam com os
domínios do Conselho e Telemedicina já documentados; o backend social não os consulta.

## Gates e isolamento

- A Home e as ações sociais básicas estão disponíveis para todas as contas
  autenticadas e ativas, inclusive Bronze. Prata continua ligada à segurança e à foto
  de perfil; Ouro continua futuro.
- O Dossiê de 31/08 restringia descoberta cidadão↔profissional. A decisão permanente
  de 11/09/2026 substitui essa limitação: qualquer conta social elegível pode ser
  localizada para amizade, independentemente do cargo.
- Cidadãos continuam sem receber **permissões de chat profissional** ou ferramentas
  por causa da amizade. O contato cidadão↔profissional, quando houver amizade aceita,
  é exclusivamente social e é revogado com remoção/bloqueio.
- Amizade, bloqueio ou suspensão social não alteram cargo, sessão ou ferramenta.
- Contas profissionais provisionadas pelo Desenvolvedor e elegíveis ao chat recebem
  amizades iniciais idempotentes; remoções/bloqueios persistem como exceção.
- Upload de mídia em posts permanece desligado até existir pipeline seguro próprio.

## Implantação

O backend e a troca da Home têm flags separadas. A implantação inicial usa backend
ativo e Home desativada para QA no domínio. A ativação da Home ocorre somente após
validação autenticada, com rollback pela flag e sem migração destrutiva.


## Home desktop — decisão de 11/09/2026

- O bloco vertical esquerdo da Home passa a mostrar Segurança, Configurações e
  Conquistas.
- Os atalhos redundantes Ver meu perfil, Amigos e pedidos, Notificações sociais e
  Privacidade social foram removidos desse bloco.
- Na barra horizontal da Home, o espaço liberado recebe a busca social de usuários.
  Desde 11/09/2026, a descoberta para amizade não separa cidadãos e profissionais;
  visibilidade, aceite de pedidos, bloqueio, suspensão e rate limit continuam
  obrigatórios. Uma amizade aceita pode abrir chat social, sem qualquer promoção de
  cargo ou permissão institucional.
- Em outras rotas e no mobile, a navegação preserva os destinos necessários.
