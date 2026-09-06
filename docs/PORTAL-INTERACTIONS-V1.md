# Camada de interações do Portal V1

Decisão permanente de UX registrada em 06/09/2026.

## Objetivo

O Portal da Regulação de Saúde de Eldorado/MS utiliza uma linguagem única de resposta a ações relevantes. Movimento, estado visual, cor, som e mensagens curtas devem comunicar a mesma intenção sem alterar autenticação, permissões, regras assistenciais ou regras de negócio.

A camada é progressiva: uma operação continua funcionando quando Web Audio, View Transitions, notificações, animações ou armazenamento remoto não estiverem disponíveis.

## Arquitetura

- `js/portal-interactions.js`: `PortalInteractions`, gerenciador central de eventos, estados, movimento, foco, anúncios acessíveis e preferências.
- `css/portal-interactions.css`: tokens e estados visuais compartilhados, transições progressivas, foco visível, movimento reduzido e cores forçadas.
- `assets/sounds/ui-*.wav`: identidade sonora original e local, sem serviço ou pacote externo.
- `scripts/generate-interaction-sounds.mjs`: geração determinística dos arquivos de áudio.
- `/conta/`: configuração global de sons, volume e silêncio rápido.
- `worker/auth-management-v2.js`: persistência das preferências na conta, com fallback local no navegador.

Não deve ser criado um segundo gerenciador por módulo. Novas páginas carregam os dois arquivos centrais e registram somente as interações que possuem significado operacional.

## API pública

```js
PortalInteractions.emit('open', { source: button });
PortalInteractions.notify('success', 'Alteração salva.', statusElement);

const finish = PortalInteractions.beginTask(saveButton);
try {
  await save();
  finish('success', { announce: 'Alteração salva.' });
} catch (error) {
  finish('error', { announce: 'Não foi possível salvar.', assertive: true });
}

PortalInteractions.register({
  selector: '[data-action="change-view"]',
  type: 'filter',
  updateSelector: '#results'
});

await PortalInteractions.transition(() => renderResults(), {
  updateSelector: '#results'
});
```

As categorias disponíveis são: `click`, `primary`, `open`, `close`, `transition`, `filter`, `selection`, `expand`, `collapse`, `loading`, `loaded`, `save`, `confirm`, `success`, `warning`, `error`, `destructive`, `notification`, `state-change`, `task-complete`, `navigation-enter`, `navigation-exit` e `copy`.

## Tokens centrais

| Token | Valor | Uso |
|---|---:|---|
| movimento imediato | 80 ms | resposta instantânea simples |
| movimento rápido | 110 ms | pressão de botão e saída |
| movimento padrão | 180 ms | modal, card e reorganização |
| movimento lento | 240 ms | somente composições que precisam de continuidade |
| easing de entrada | `cubic-bezier(.2,.8,.2,1)` | entrada e confirmação |
| volume inicial | 32% | volume moderado quando o usuário ativa o recurso |

Nenhuma transição pode bloquear uma ação ou impor espera. Com `prefers-reduced-motion: reduce`, movimentos não essenciais caem para 1 ms e transformações decorativas são removidas.

## Identidade sonora

Os sons são PCM WAV mono, 22,05 kHz, gerados no repositório. O conjunto inteiro possui aproximadamente 74 KB. O áudio é desbloqueado somente depois de gesto válido e nunca é condição para concluir uma operação.

| Arquivo | Duração | Intenção |
|---|---:|---|
| `ui-click.wav` | 60 ms | ação deliberada simples |
| `ui-open.wav` | 130 ms | abrir modal ou ferramenta auxiliar |
| `ui-close.wav` | 120 ms | fechar, recolher ou sair |
| `ui-transition.wav` | 130 ms | filtro, seleção ou mudança de visualização |
| `ui-success.wav` | 200 ms | salvamento ou confirmação efetivamente concluída |
| `ui-warning.wav` | 190 ms | atenção necessária sem falha impeditiva |
| `ui-error.wav` | 200 ms | operação não concluída |
| `ui-notification.wav` | 180 ms | novo evento relevante |
| `ui-destructive.wav` | 200 ms | ação destrutiva deliberada |
| `ui-complete.wav` | 250 ms | conclusão perceptível de uma tarefa composta |

Não existe áudio em hover. Cooldowns por categoria, prioridade e limite de fontes simultâneas evitam spam e sobreposição caótica. Se o arquivo ainda não estiver decodificado, um tom sintético equivalente pode responder imediatamente; a falha de qualquer mecanismo de áudio é silenciosamente tolerada.

## Preferências

Contas existentes e novas começam com sons desativados. A opção só é ativada por decisão do usuário em `/conta/`.

- `interface_sounds_enabled`: liga ou desliga a identidade sonora.
- `interface_sound_volume`: inteiro entre 0 e 100; padrão 32.
- `interface_sounds_muted`: silêncio rápido sem perder o volume escolhido.

As preferências são gravadas no D1 pela API autenticada `/api/auth/security` e espelhadas por conta no `localStorage` para resposta imediata e contingência. Quando os sons estão ativos, um controle vetorial discreto permite silenciar rapidamente o Portal em qualquer ferramenta.

## Matriz auditada por rota

| Rota | Respostas classificadas |
|---|---|
| `/` | entrada nas ferramentas, saída, chat e notificações |
| `/login/` | envio, erro de autenticação e entrada no cadastro |
| `/cadastro/` | envio, validação, sucesso e retorno ao acesso |
| `/medico/` | filtros, seleção de protocolo, cópia, impressão, checklist, assistente e chat |
| `/protocolo/` | filtros, seleção, atualização de conteúdo e retorno ao guia |
| `/recepcao/` | seleção de protocolo, checklist, limpeza, impressão, navegação e chat |
| `/telemedicina/` | filtros, Lista/Grade, cards, modais, consulta, programação, solicitação, cópia, aviso diário e erros |
| `/cidadao/` | nova manifestação, atualização, anexos, privacidade, abas, notificações, modais e saída |
| `/conselho/` | entrada em cadastro ou login e resposta dos cards públicos |
| `/conselho/painel/` | filtros, abertura, resposta, andamento, exportação, exclusão, atualização e saída |
| `/conta/` | formulários, foto, e-mail, senha, preferências de interface e saída |
| `/admin/usuarios/` | criação, edição, redefinição, filtros implícitos, resultados e saída |
| `/admin/monitoramento/` | períodos, seleção de profissional, atualização de conteúdo, chat e saída |
| `/admin/configuracao/` | diagnóstico, carregamento, conclusão, bloqueios, erro e saída |

`/home/` e `/protocolo.html` continuam sendo redirecionamentos de compatibilidade, sem efeitos próprios.

## Regras de acessibilidade e desempenho

- Nenhuma informação depende somente de cor, som ou movimento.
- Estados relevantes permanecem textuais e utilizam `role=status`, `role=alert`, `aria-live` ou o anunciador central conforme o contexto.
- Foco por teclado é visível e o foco retorna ao acionador depois do fechamento de camadas observadas.
- Modais preservam seus controles existentes; a camada apenas acompanha a entrada e a saída.
- `prefers-reduced-motion`, `forced-colors`, controles desabilitados e volume zero possuem tratamento explícito.
- O áudio usa carregamento ocioso, somente quando habilitado, e Web Audio compartilhado.
- A delegação central utiliza uma quantidade fixa de listeners; não existe listener sonoro adicionado a cada botão.
- MutationObserver é único, filtrado para estados e camadas conhecidos.
- Nenhum nome de paciente, texto clínico, segredo ou conteúdo de manifestação é registrado pela camada.

## Diretriz para novas ferramentas

1. Reutilizar os tokens e a API central.
2. Classificar a intenção antes de adicionar feedback.
3. Não sonorizar todo `button` ou `a` e não produzir som em hover.
4. Não emitir sucesso antes da resposta efetiva do backend.
5. Impedir reprodução duplicada quando clique e resultado pertencem ao mesmo fluxo.
6. Usar SVG vetorial consistente; emojis não são permitidos na interface.
7. Manter mensagem específica de erro próxima ao ponto de falha.
8. Testar sons ligados, desligados, silenciados e nos extremos de volume.
9. Testar áudio bloqueado, teclado, foco, desktop, mobile e movimento reduzido.
10. Atualizar cache-busting, testes e esta matriz quando uma rota ou categoria mudar.

## Validação automatizada

`worker/tests/portal-interactions.test.mjs` verifica as rotas, a API, os padrões não invasivos, os arquivos de áudio, a persistência, a acessibilidade estrutural e a ausência de emojis nas interfaces ativas. O workflow `validate-portal-interactions.yml` também regenera os sons e exige saída binária determinística.
