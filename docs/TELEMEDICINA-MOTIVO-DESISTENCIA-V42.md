# Telemedicina — Motivo opcional da desistência V42

Data: 24/09/2026.

## Objetivo

Quando o resultado de uma teleconsulta for **Desistiu**, permitir registrar o **motivo da desistência** em uma caixa de texto opcional, tanto no desktop quanto no fluxo mobile.

## Regra funcional

- Ao selecionar **Desistiu**, o campo antes usado como observação operacional é exibido com o rótulo **Motivo da desistência**.
- O preenchimento é **opcional**. Uma desistência continua podendo ser salva sem texto.
- Se preenchido, o conteúdo acompanha o evento histórico e o acompanhamento da especialidade.
- No histórico do paciente, o texto é apresentado com o rótulo **Motivo:**.
- A conduta canônica permanece **PACIENTE DESISTIU DO TRATAMENTO**.
- A desistência continua encerrando o acompanhamento sem retorno, alerta ou lembrete.
- Alta, falta, retorno por prazo/data, retorno por condição e encaminhamento presencial não mudam de regra.

## Persistência

A implementação reutiliza o campo já existente `notes` do evento/acompanhamento, sem criar nova coleção, migração ou escrita destrutiva. O backend preserva `notes` somente quando a resolução canônica é de desistência; uma alta normal continua limpando observações incompatíveis.

## Interface e cache

A camada de desfechos continua em `js/telemedicina-absence-v24.js`, com cache-buster `v=20260924-1`. A página expõe `data-withdrawal-reason="v42"` para diagnóstico de versão.

## Privacidade e observabilidade

O motivo pode conter conteúdo clínico/operacional e, por isso, permanece somente no armazenamento funcional autorizado da Telemedicina. Nenhum conteúdo desse campo é enviado ao PostHog ou a telemetria técnica.

## Validação

O teste `worker/tests/telemedicine-withdrawal-reason-v42.test.mjs` verifica:
- campo/rótulo opcional no desktop e no mobile;
- preservação do texto pelo adaptador de desfechos;
- preservação pelo Worker legado e pelo salvamento atômico V29;
- rótulo **Motivo:** no histórico;
- cache-buster e marcador V42.
