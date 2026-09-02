# Telemedicina - refinamento mobile V3

Decisão permanente registrada em 02/09/2026.

## Escopo

Esta alteração é exclusivamente de experiência mobile da rota `/telemedicina/`.

O desktop deve permanecer visual e funcionalmente preservado. Por isso, o refinamento foi implementado em um stylesheet separado, `css/telemedicina-mobile-v3.css`, carregado depois do CSS principal.

A detecção mobile considera tanto viewport de até 860 px quanto dispositivo físico compacto com ponteiro `coarse`. Isso evita que celulares Android que estejam renderizando com viewport de desktop deixem de receber a interface mobile, sem atingir desktops reais.

## Objetivos de usabilidade

No celular, a operação deve priorizar leitura rápida, toque confortável e menor rolagem até a lista de acompanhamentos.

A V3 estabelece:

- cabeçalho mais compacto, preservando somente os controles essenciais;
- hero reduzido para título curto, data operacional e quantidade de avisos;
- resumo operacional em grade 2 x 2, com números em destaque;
- busca e filtro fixados no topo da área de trabalho durante a rolagem;
- `Registrar consulta` como botão flutuante `+ Nova consulta`;
- `Importar histórico` fora da área operacional mobile, porque é uma ação administrativa eventual e continua disponível no desktop;
- acompanhamentos exibidos como cards verticais, não como tabela comprimida;
- borda lateral contextual para `ATRASADO`, `SOLICITAR`, `EM AGUARDO` e `SEM PROGRAMAÇÃO`;
- nome e conduta com leitura integral em múltiplas linhas;
- especialidade e status agrupados no mesmo bloco;
- datas e avisos preservados em bloco próprio quando existirem;
- ação primária `Solicitado` com prioridade visual e largura total no card;
- formulários e histórico como painel inferior (`bottom sheet`) no celular;
- áreas de toque com altura adequada para operação com uma mão.

## Cache e publicação

O HTML da Telemedicina carrega o arquivo com versão explícita `telemedicina-mobile-v3.css?v=20260902-2` e marca o `body` com `data-mobile-ui="v3"`.

Além de evitar reaproveitamento do CSS antigo pelo navegador, esses marcadores permitem conferir com facilidade se a versão publicada corresponde à V3.

## Segurança

Esta alteração não modifica autenticação, API, Firestore, dados de pacientes, regras de retorno ou permissões. Nenhum dado sensível é incluído em HTML, CSS, documentação de interface ou GitHub.

## Arquivos

- `telemedicina/index.html`
- `css/telemedicina-mobile-v3.css`
- `.github/workflows/validate-telemedicine-mobile-v3.yml`
- `docs/TELEMEDICINA-MOBILE-V3.md`
