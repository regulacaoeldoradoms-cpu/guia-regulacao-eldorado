# Telemedicina — retirada do importador da interface

Decisão permanente registrada em 03/09/2026.

A migração histórica inicial da Telemedicina foi concluída. O botão **Importar histórico** não deve mais ser exibido em nenhum perfil ou acesso do módulo `/telemedicina/`, inclusive para o Desenvolvedor.

A interface operacional passa a apresentar apenas as ações de uso corrente, como notificações e registro de consulta. O fluxo técnico legado de importação no backend não deve ser reexposto na interface sem nova decisão explícita e revisão da necessidade operacional.

Esta decisão preserva os dados já migrados e não altera o histórico existente.