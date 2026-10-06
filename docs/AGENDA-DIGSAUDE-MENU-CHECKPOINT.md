# Agenda: candidato de diagnostico dos pendentes

Base main `6167fbaf267ab628684564b70709b40a8750e0f0`; branch `fix/agenda-pending-contact-diagnostics`. Candidato 1.2.7/coletor e ponte `20261005-pending-1`, frontend `20261005-contact-2`, protocolo `patient-details-v2`. PR draft, sem merge/deploy ou coleta real nesta etapa.

Producao 1.2.6 confirmada pelo gate e pelo operador. O operador conferiu os 19 contatos iniciais; depois relatou recuperacao incremental, um caso persistente e tres possivelmente passados. Contagem final e causas individuais nao confirmadas; todos os cadastros tem telefone preenchido segundo o operador. Nao registrar dados pessoais nem repetir essa pergunta. Previa de contato dispensada.

Reproducao sintetica: campo disponivel aos 9s falha na janela de 8s e uma leitura posterior com novo Document recupera. O candidato permite uma repeticao somente para timeout de navegacao/dialogo ou indisponibilidade de captura do campo, com espera de 250ms, nova navegacao e todas as guardas. Concorrencia e janelas permanecem iguais; formatos invalidos, ambiguidade, mudancas de identidade/rota/Document, cancelamento e menu que nao abre nao sao repetidos. Contatos conhecidos nao sao alvos.

Painel somente agregado: recorte/completude, etapas e duracao das tentativas, recuperacoes e confirmacao de persistencia. Sem nomes, IDs, numeros ou mensagens de excecao; motivos historicos desconhecidos permanecem sem classificacao. Ponte acrescenta somente contagem recebida no ACK. Campo indisponivel na captura nao prova cadastro vazio. Worker, gates, credenciais e UI de avisos preservados.

Validacao local reaproveitada: oito testes do diagnostico original; quatro novos de atraso/retry e treze regressoes afetadas passaram. Integracao/metadados da versao final e CI terminal serao registrados no PR. Proxima etapa: revisao e publicacao normal expressamente autorizadas antes de piloto dos pendentes, sem WhatsApp. Nao solicitar nova rodada agora; otimizacao geral posterior.
