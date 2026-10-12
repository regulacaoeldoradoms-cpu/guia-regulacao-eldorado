# Preparação do Gnomo e da idade privada

Estado: componentes isolados, ainda sem integração funcional ou publicação. O catálogo e o runtime atuais dos gatos não foram alterados.

## Componentes preparados

- `worker/private-pet-age.js`: data de nascimento civil estrita, rejeição de datas inválidas/futuras, estado desconhecido fechado, aniversário de 18 anos no calendário de America/Campo_Grande. Nascimento em 29/02 permanece bloqueado até 01/03 nos anos não bissextos (decisão conservadora de produto, sem alegação de interpretação legal).
- `js/gnome-reading-time.js`: 180 palavras/minuto mais 2 segundos, mínimo de 6 segundos, duração individual sem teto para frases longas. Configurável; duração dos gatos intacta.
- `worker/gnome-phrases.js`: 38 falas aprovadas, versionadas e apenas no servidor. Nenhum import em assets do navegador nem endpoint entregando esse conteúdo.
- Testes sintéticos de aniversário, madrugada UTC versus data local, ano bissexto, dados inválidos e tempo de leitura.

## Integração que ainda precisa ser concluída

O cadastro atual não coleta nascimento e `sanitizeCitizenRegistrationRequest` preserva somente username/password. O cadastro, a sanitização e a persistência devem ser atualizados juntos, com armazenamento privado separado e inserção atômica com a conta; não inserir uma conta incompleta em caso de falha. Contas existentes precisam de coleta mínima autenticada e declaração imutável por autoatendimento para evitar alteração trivial após uma negativa.

O catálogo atual exige sessão, mas não idade; `persistPetCommand` é a fronteira de adoção e precisa verificar a elegibilidade novamente no servidor, inclusive operação idempotente e mudanças de sessão. Nenhuma frase adulta deve constar de payloads de menores/idade desconhecida, bundle público ou estado genérico de gatos. Data de nascimento nunca deve aparecer em publicUser, perfil social, logs ou analytics. A declaração de nascimento não equivale a verificação documental.

Faltam migração reversível, cadastro e coleta legada, endpoints/gates de catálogo/adoção/falas, ciclos sem repetição imediata e armazenamento de prazos compatível com sessão. Preservar pausa em aba oculta, prioridade de necessidades urgentes e continuidade de módulo; testar revogação, cliente adulterado, conta menor e desconhecida.

Arte e runtime ainda precisam implementar as sete ações aprovadas como animações reais: caminhar rebolando, correr segurando chapéu, coçar barba, tropeçar/disfarçar, rir sacudindo barriga, dançar e cochilar encostado em cogumelo. Criar arte via imagegen com tamanho/âncora consistentes e frames leves; não tratar poses estáticas como animação concluída. Preservar um mascote ativo, economia, vidas e itens; não inventar preços ou alterar os gatos.

Publicação depende de pacote completo do bloqueio e de todos os gates existentes, com o pipeline protegido do Worker. Estes componentes isolados não tornam o recurso pronto para produção.
