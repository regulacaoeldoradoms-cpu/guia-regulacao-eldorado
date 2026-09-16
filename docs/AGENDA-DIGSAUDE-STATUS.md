# Agenda DigSaúde — Status

Atualizado em 16/09/2026.

## Estado atual

- Frente: Agenda DigSaúde V1.
- Objetivo: disponibilizar no Portal uma fila somente de leitura dos agendamentos do DigSaúde para Técnico em Telemedicina e Desenvolvedor.
- Branch: `feat/agenda-digsaude-v1`.
- PR: pendente de abertura.
- Base inicial: `main` em `5859b77fc80e17ffdf98f9e6fb3fa34bc37721c3`.
- Produção: nenhuma alteração publicada por esta frente.

## Concluído na branch

- rota `/agenda/` com resumo, filtros, pesquisa e estado individual de visualização;
- card **Agenda** no catálogo apenas para Telemedicina/Desenvolvedor;
- API protegida `/api/agenda`, `/api/agenda/sync` e `/api/agenda/read`;
- persistência no Firestore com ID de documento derivado por hash;
- sincronizador local para a aba Agendados do DigSaúde;
- ponte `postMessage` que mantém a sessão do Portal fora da origem do DigSaúde;
- registros ausentes são desativados somente em snapshot comprovadamente completo;
- nenhuma credencial, cookie ou token do DigSaúde é coletado;
- página Agenda sem PostHog/observabilidade para impedir vazamento de dados de pacientes;
- testes e workflow dedicados adicionados.

## Decisões e justificativas

- **DigSaúde continua fonte oficial:** o Portal é uma camada de acompanhamento, não um sistema concorrente.
- **Sem automação de login:** evita armazenar senha ou sessão institucional no backend.
- **Sincronização iniciada no navegador autorizado:** usa somente dados que o usuário já pode visualizar.
- **Leitura individual:** resolve o caso em que um técnico visualiza um agendamento e outro ainda precisa enxergá-lo como novo.
- **Não excluir ausentes:** uma consulta que saiu de Agendados pode ter mudado de situação; preservar o registro evita perda de contexto.
- **Não instrumentar conteúdo da Agenda:** dados assistenciais e identidade clínica não entram no PostHog.

## Alternativas descartadas nesta versão

- iframe do DigSaúde;
- uso de `/livewire/update` como se fosse API pública;
- armazenamento de usuário/senha do DigSaúde no Portal;
- scraping visual por coordenadas/pixels;
- exclusão automática de registros que desaparecem da lista.

## Pendências e bloqueios

- validar os checks do Pull Request;
- homologar a primeira sincronização com uma sessão real do DigSaúde;
- confirmar o comportamento quando a lista ultrapassar 50 itens em uma única página;
- a sincronização totalmente automática depende de integração institucional apropriada e não faz parte da V1.

## Riscos conhecidos

- mudanças futuras no HTML Filament/Livewire do DigSaúde podem exigir ajuste do extrator;
- bloqueio de pop-up pode impedir a abertura da ponte até o usuário autorizar o domínio;
- snapshot parcial nunca deve desativar registros ausentes.

## Handoff para o próximo chat

- **Frente atual:** Agenda DigSaúde V1.
- **Última ação concluída:** implementação inicial da interface, backend, sincronizador e testes na branch.
- **Branch atual:** `feat/agenda-digsaude-v1`.
- **PR atual:** pendente de abertura.
- **Checks e testes:** workflow criado; execução no GitHub ainda pendente.
- **Próxima ação exata:** abrir o PR, aguardar os workflows e corrigir qualquer falha antes de solicitar homologação.
- **Arquivos principais:** `docs/AGENDA-DIGSAUDE.md`, `worker/agenda.js`, `agenda/digsaude-agenda-sync.user.js`, `agenda/index.html`.
