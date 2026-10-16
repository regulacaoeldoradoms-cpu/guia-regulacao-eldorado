# Cadastro: identidade visual do Portal — candidata local

Branch `feat/signup-portal-branding-20261015`, worktree `/workspace/guia-signup-portal-branding`, base publicada `d846f02d8c0063738c7be383c3b075a0e6c1904c` (PR #660 já integrado). Esta é uma alteração nova de apresentação; o PR anterior não foi refeito. Sem push, PR novo, integração, publicação ou migração. A autorização atual cobre somente preparação e testes locais; qualquer ação externa requer nova aprovação imediatamente antes.

## Visibilidade no portal e identificação da manifestação

A inspeção foi relatada antes de definir a redação:

- O cadastro usa o usuário como nome inicial (`registerCitizen` em `worker/auth-management-v2.js`); a identidade social usa o usuário como identificador inicial (`worker/citizen-identity.js` e `worker/social-schema.js`). Perfil, Amigos e contatos autorizados de chat podem exibir nome/identificador a outras pessoas (`publicSummary`/`profilePayload` em `worker/social.js`, `js/social-friends.js` e projeções de `worker/portal-chat-v2.js`). As APIs exigem sessão e suas regras de acesso; isso não significa acesso livre pela internet e é separado da identificação de um protocolo.
- `manifestationPrivacyMode` em `worker/council.js` decide a modalidade por manifestação: identificada por escolha explícita; caso contrário, sigilosa para e-mail verificado ou anônima para conta não verificada. `authorIdentity` é incluído na criação identificada. As projeções anônimas/sigilosas omitem a identidade explícita; membros/vice-presidência recebem projeções adicionais protegidas. O vínculo técnico conta/protocolo permanece no índice protegido.
- `worker/council-access-policy.js` também concede ao Desenvolvedor a capacidade operacional da Presidência no painel institucional. A interface de cadastro não deve prometer acesso exclusivo da presidente nem confundir o identificador social com essa autorização.
- Nascimento/gênero permanecem privados e separados dessas projeções. Nenhuma regra, permissão, validação ou dado foi alterado por esta candidata.

O bloco grande que proibia nome completo foi removido. A orientação curta fica no próprio campo, associada por `aria-describedby`: **“Pode aparecer para outras pessoas no perfil e no chat.”** O texto de formato de 3 a 40 caracteres foi mantido. A frase informa a exposição possível, sem proibir nome completo ou prometer anonimato do identificador social.

## Apresentação

- Cabeçalho, nome acessível e título da página usam **Portal da Regulação de Saúde**. Subtítulo de desktop: “Cadastro de conta · Eldorado/MS”.
- Logo e favicon reutilizam `assets/portal-regulacao-header_512x512.png`, a variante quadrada oficial da Home/Segurança. Ela e a imagem de 1280 px usada no login (`assets/portal-regulacao-header.png`) foram abertas e inspecionadas: representam a mesma identidade gráfica do Portal. Nenhuma arte nova, recorte ou alteração dos arquivos foi produzida. `object-fit:contain`, dimensões reservadas e prioridade de carregamento preservam a identidade desde o HTML inicial.
- CSS adicional é restrito à marca do cadastro; a URL dessa folha foi versionada. Namespaces, políticas e código do service worker permanecem iguais à base.
- Formulário, tipo de conta Bronze/cidadão, senha/confirmação, nascimento obrigatório, gênero opcional e consentimento foram preservados. Não há mudança em servidores, banco, autenticação, permissões, manifestação, tutorial, abertura móvel ou Agenda/DigSaúde.

## Validação sintética

- **10 cenários nativos de cadastro**: 320/360/390/412/1440 px × claro/escuro. Exercitam validações, consentimento, nascimento/gênero, envio e privacidade de armazenamento usando os roteadores reais com SQLite sintético. `/tmp/signup-branding-flows.log`; capturas `.local/signup-branding/flows/`.
- **Seis cenários nativos com texto 200%**: 320/412/1440 px × claro/escuro, sem overflow horizontal e sem violações axe WCAG A/AA no formulário. `/tmp/signup-branding-text200.log`; capturas `.local/signup-branding/text200/`.
- **Quatro comparações estritas** de cadastro em desktop/mobile e claro/impressão contra `d846f02d`. O teste afirma a marca/disclosure aprovadas antes de projetar apenas essas alterações editoriais para comparar os controles e pixels anteriores. Nenhuma rota ou limite de raster/layout foi relaxado. `/tmp/signup-branding-preservation.log`.
- **37 testes de política de cache e nove cenários Chromium de cliente instalado** aprovados. Incluem atualização de HTML do cadastro, preservação de caches/rascunhos e fallback offline. `/tmp/signup-branding-cache-policy.log` e `/tmp/signup-branding-installed-cache.log`.
- Sintaxe do helper e diff aprovados. A asserção antiga do Conselho que exigia o aviso removido foi substituída por asserções da orientação breve, associação acessível e ausência do bloco grande.
- **30 cenários de primeiro paint**: 320/360/390/412/1440 px × claro/escuro × entrada fria/recarga/HTML antigo no cache. Foram medidos **475 frames**, sem a marca antiga nem o aviso removido, sem overflow ou título cortado e com axe WCAG A/AA aprovado para cabeçalho/formulário em cada tamanho/tema. O terceiro modo usa o service worker real e o HTML de `d846f02d` sem modificações como cache inicial, com rede disponível; nenhum código do SW foi substituído. `/tmp/signup-branding-paint.log`; capturas/relatório `.local/signup-branding/paint/`.
- Controle negativo aprovado: ao servir deliberadamente o HTML anterior, o mesmo detector rejeitou a marca “Canal do Cidadão” e o ícone antigo. `/tmp/signup-branding-negative-control.log`.
- **14 controles** conservaram seus atributos originais; somente o usuário recebeu a nova associação descritiva. O consentimento permaneceu idêntico byte a byte. O modelo de cache do servidor sintético usa assets públicos cacheáveis, conforme os testes existentes, e não o header `no-store` reservado a respostas privadas.
- Capturas reais de 320 claro, 412 escuro, 1440 claro, texto 200% e as duas variantes da logo oficial foram abertas e inspecionadas. São navegadores sintéticos, sem aparelho físico ou contas em produção.

As suítes de servidor e os checks pós-merge da base publicada são reaproveitados somente nos arquivos de produto inalterados. Não foram repetidos por esta alteração de HTML/CSS/texto. Não existe CI remoto desta candidata, pois nenhum push/PR foi autorizado nesta etapa.

## Referência e limites

O download autorizado da referência da Biblioteca `1000644208.jpg` falhou com “download failed”; seus bytes não foram inspecionados nem redistribuídos. A descrição do print confirmada pela coordenação foi confrontada com o HTML da base e com novas renderizações locais usando dados sintéticos. Isso não exigiu outro editor ou acesso a dados reais.

O registro final de testes e o commit da candidata ficam em `.local/signup-branding/checkpoint.json`. A ausência de marca antiga foi verificada no HTML atual e na atualização online do cache. As políticas existentes de fallback lento/offline permanecem: um cliente sem os novos bytes pode conservar o HTML antigo até obter atualização. O cadastro público mantém seu fluxo e suas validações originais; a mudança é de apresentação e orientação. Nenhum SQL deve ser reaplicado.
