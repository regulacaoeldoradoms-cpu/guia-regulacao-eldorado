# Login compacto no celular

O login móvel exibia título de 48px e inputs de 80px, com introdução/cadastro extensos. Em320px, a captura sintética inicial tinha formulário em746px e botão Entrar abaixo de1500px. A apresentação compacta mantém logo, nome do portal e uma frase; resume cadastro e autorização profissional, usa inputs de48px e deixa as ações principais próximas da entrada. Em320px, o formulário aparece em234px e Entrar em609px. Esses valores são de viewport sintético de820px de altura, sem teclado real.

CSS móvel fica em `css/login-mobile.css`, com resumo aplicado somente à classe móvel. O bloco de CSS que ampliava a tela foi retirado de `js/login.js`; lógica de autenticação permanece idêntica. Campos, labels, autocomplete, lembrar acesso, mostrar/ocultar senha, status/erros e link de cadastro usam os controles originais. A rota não tinha link separado de recuperação; nenhum fluxo de recuperação existente foi removido.

`testing/citizen-layout/mobile-login.mjs` testa320/390px, texto sintético200%, temas claro/escuro, viewport reduzido simulando espaço do teclado, navegação por Tab, erro401 sintético e retry/cadastro.10cenários/92checks. Não realiza login real nem lê dados pessoais. Capturas antes/depois ficam em `.local/mobile-login/`.

O gate visual mantém comparação exata de desktop/claro e desktop/impressão. Para o login móvel, a alteração intencional de texto/escala usa contrato exato contra base para IDs, campos, atributos de segurança/acessibilidade, links e cores dos controles, além da suíte dedicada de reflow/erros. Limites de pixel/estilo dos demais módulos permanecem iguais. Nenhuma alteração de credenciais, auth, permissões ou Worker.
