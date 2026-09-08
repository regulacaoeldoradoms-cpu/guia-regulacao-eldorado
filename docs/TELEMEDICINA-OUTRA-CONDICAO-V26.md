# Telemedicina - Outra condição V26

Decisão permanente registrada em 08/09/2026.

## Objetivo

Corrigir o formulário **Registrar teleconsulta** após a V25 para que o operador não veja mais o texto residual **Detalhe da condição / Opcional, exceto em “Outra condição”** e para restaurar **Outra condição** como opção válida de retorno condicional.

## Regra de interface

Em **Retorno após uma condição**, ficam disponíveis:

- Exames;
- Fisioterapia;
- Procedimento ou cirurgia;
- Conclusão do tratamento;
- Outra condição.

Não existe mais campo de texto livre para detalhar a condição. O controle **Já realizado** continua sendo usado para todas as opções, inclusive **Outra condição**.

## Comportamento de Outra condição

### Não realizado

Ao selecionar **Outra condição** e manter **Já realizado** desligado:

- a conduta canônica é **RETORNO APÓS OUTRA CONDIÇÃO**;
- não é criada data-alvo artificial;
- não são criados lembretes artificiais;
- o acompanhamento permanece em **SEM PROGRAMAÇÃO** até a condição ser concluída.

### Já realizado

Ao selecionar **Outra condição** e marcar **Já realizado**:

- a conduta canônica passa a **RETORNO APÓS OUTRA CONDIÇÃO - JÁ REALIZADO**;
- não é criada data-alvo artificial;
- não são criados lembretes artificiais;
- o acompanhamento entra imediatamente em **SOLICITAR** e sobe junto de **Solicitar agora**;
- após confirmar **Solicitado**, passa normalmente a **SOLICITADO**.

## Compatibilidade

A V26 é uma camada pequena carregada depois da V25 e antes dos módulos principais da Telemedicina. Ela preserva:

- Falta;
- Desistiu;
- Encaminhado para presencial;
- retornos com prazo/data;
- retornos condicionais existentes;
- desktop e formulário inline mobile;
- a decisão de manter `/telemedicina/` sem animações.

A camada também remove do DOM o bloco visual antigo de detalhe da condição, mantendo apenas o campo técnico oculto necessário para compatibilidade com o contrato existente do formulário.

## Segurança e privacidade

- nenhuma permissão é alterada;
- nenhum dado de paciente é versionado;
- nenhuma regra de autenticação é modificada;
- a alteração é restrita ao fluxo de registro da Telemedicina.

## Arquivos

- `telemedicina/index.html`;
- `js/telemedicina-condition-other-v26.js`;
- `.github/workflows/validate-telemedicine-condition-other-v26.yml`;
- `docs/TELEMEDICINA-OUTRA-CONDICAO-V26.md`.
