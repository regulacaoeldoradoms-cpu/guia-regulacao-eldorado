# Grupos do chat — checkpoint V1

## Estado de entrega em 08/10/2026

**Grupos ainda não integrados à main nem publicados.**
PR de implementação: #611, branch `feat/chat-groups-reviewed-20261008`.
Main conferida: `8e1a208bb924606a85aa4ada2397a81ae80011b5` (PR #609).
Head de runtime conferido: `348f4d6c947f1e59e4cd94cc367a70a3e2b2e264`.
Versão prevista: `20261008-chat-groups-1`.
Regra e funcionamento: [CHAT-GRUPOS.md](CHAT-GRUPOS.md).
A PR #610 contém apenas o registro inicial e foi substituída por esta implementação.

A cópia local está mais avançada que o runtime desta branch. O comentário
#6059463452 na PR #611 registra a retomada após a reconexão do ambiente.
Este commit altera apenas documentação; não publica as correções locais.

## Regra preservada

Somente amigos aceitos e vigentes do criador original podem ser convidados e
aceitar entrada. Outros administradores não usam apenas os próprios amigos.
Compartilhar grupo não cria amizade nem libera conversas individuais ou ferramentas.
As verificações de sessão, participação e amizade continuam no servidor.

## Implementação e evidências anteriores

A candidata incorpora Novo grupo, filtros, fotos, convites com aceite, administração,
recibos, silenciamento, saída, reentrada limitada e divisões por data.
As pendências de Reenviar, diálogos antigos, desativação, intervalos de participação,
limites, convites privados e emoticons já foram tratadas na cópia preservada.
O caso residual de preload da PR #608 e a duplicação do contador também foram tratados.
A conciliação com os 26 arquivos concorrentes da PR #609 foi preservada.

Evidências anteriores: 826/826 testes Node, 15/15 cenários de recebimento individual,
8/8 de apresentação e 4/4 combinações de grupos. Não equivalem a aceite produtivo.

## Avanço local desta retomada

- `worker/chat-groups.js`: destinatários de push de convite limitados aos novos
  convidados, preservando a invalidação realtime do grupo.
- Histórico transmite a foto uma vez por remetente da página, em `senders`, não uma
  cópia em cada mensagem. A consulta das imagens revalida sessão e participação.
- `js/portal-chat-groups.js`: associa as fotos aos balões somente em memória.
- Novo arquivo local `worker/tests/chat-group-notification-payload.test.mjs` contém
  três regressões; os dois problemas foram reproduzidos antes da correção.
- Resultado executado nesta retomada: **29/29 testes focados**, sem skips, sintaxe
  aprovada e **4/4 combinações de grupos no navegador** com três contas fictícias.

Evidências: `resume-final-tests.log`, `resume-browser.log` e
`evidence-resumed/groups-browser.json`. Backup anterior em `before-final-review`.
A pasta de desenvolvimento continua `portal-chat-groups-20261008/repo`.
O script `resume-final-review.cjs` foi aplicado uma vez; não repetir.
Nenhuma conta/conversa real ou banco produtivo foi usado.

## Pendências antes do merge

A ferramenta bloqueou a escrita de `stage-resumed-review.cjs` por não conseguir
determinar o status de segurança. O empacotamento não foi executado e as correções
locais acima não foram enviadas à branch. Não contornar esse bloqueio.

Na próxima retomada autorizada, conferir novamente o estado e:

1. Integrar as correções locais e os três testes ao gate existente, evitando
   execução duplicada. Conferir também o ajuste local de retry após encerramento.
2. Atualizar especificação e manifesto com o diff efetivo. A comparação anterior
   parou em 48 arquivos na branch versus 47 no manifesto; não foi aprovada.
3. Remover `.github/workflows/apply-group-avatar-review.yml`, auxiliar ainda presente
   no head conferido, antes de integrar. Não carregar auxiliares temporários à main.
4. Executar os gates do head final e conferir os apontamentos de revisão. Os dois
   builds de preview encontrados no head não substituem o conjunto de validações.
5. Integrar/publicar exclusivamente pelo gate seguro existente e verificar Pages,
   Worker, arquivos públicos, realtime e barreira anônima/CORS das APIs.

Preservar o trabalho pronto e reutilizar evidências ainda válidas. Não reconstruir
os grupos nem repetir suítes intactas sem necessidade. Não anunciar publicação,
criptografia ponta a ponta, anexos ou chamadas antes de existir evidência da entrega.
