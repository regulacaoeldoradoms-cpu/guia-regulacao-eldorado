# Telemedicina - refinamento mobile V4

Decisão permanente registrada em 02/09/2026.

## Escopo

A V4 continua sendo exclusivamente mobile na rota `/telemedicina/`. O desktop deve permanecer visual e funcionalmente preservado.

A V3 resolveu a apresentação em cards e a detecção de celulares Android que podem renderizar com viewport de desktop. A V4 trata o uso do espaço observado em aparelho real: reduzir áreas vazias e altura repetitiva sem sacrificar a leitura das informações operacionais.

## Decisões da V4

- manter o cabeçalho mobile compacto;
- reduzir a altura do hero e ocultar o texto explicativo redundante no celular;
- manter os quatro indicadores em grade 2 x 2, porém sem os subtítulos repetitivos dentro de cada indicador;
- fazer a busca ocupar toda a largura disponível;
- organizar filtro, avisos e `+ Consulta` na mesma faixa abaixo da busca;
- remover o comportamento flutuante de `+ Nova consulta` no mobile para evitar espaço morto e sobreposição;
- reduzir apenas paddings e espaçamentos dos cards, preservando tamanho de texto legível;
- compactar o bloco de retorno/avisos em uma única faixa flexível;
- manter `Solicitado`, `Programar` e `Histórico` em uma única linha de ações, adaptando-se automaticamente quando uma ação não estiver disponível;
- preservar estados, regras de negócio, autenticação, dados e backend sem qualquer alteração.

## Compatibilidade mobile

O stylesheet `css/telemedicina-mobile-v4.css` usa a mesma estratégia resiliente da V3:

`@media (max-width: 860px), (pointer: coarse) and (max-device-width: 900px)`

Isso permite aplicar a experiência mobile em celulares Android mesmo quando o navegador solicita um viewport mais largo, sem aplicar as regras a computadores reais.

## Segurança

A V4 é exclusivamente visual. Não adiciona dados pessoais, conteúdo clínico, credenciais ou identificadores ao repositório. Nenhuma informação de paciente é incluída no HTML estático, CSS, documentação ou workflow.

## Arquivos

- `telemedicina/index.html`
- `css/telemedicina-mobile-v4.css`
- `.github/workflows/validate-telemedicine-mobile-v4.yml`
- `docs/TELEMEDICINA-MOBILE-V4.md`
