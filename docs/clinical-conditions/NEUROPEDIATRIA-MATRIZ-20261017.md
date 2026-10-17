# Neuropediatria — matriz de conferência documental (PR #668, issue #667)

**Fonte clínica:** Protocolo de Acesso aos Serviços de Teleatendimentos do Núcleo de Telessaúde MS, versão 2.0, revisão de 06/10/2025, seção Neurologia Pediátrica, páginas **impressas 30–36** (físicas 36–42 no PDF de 72 páginas). Documento fonte identifica critérios; esta matriz **não certifica vigência operacional**.

**Regra comum:** faixa até 16 anos, 11 meses e 29 dias; todas as solicitações devem ter quadro clínico atual e documentos anexados **ou descritos**; familiar/responsável presente no teleatendimento. Aos 17 anos, fluxo não explicitado nesse recorte — confirmar com Regulação, sem inventar destino.

**Oferta:** usuário do Setor de Regulação informou retomada da Neuropediatria DigSaúde por WhatsApp; data e mensagem original não fornecidas. A main do portal já indica disponibilidade e menciona atualização local de julho/2026. Oferta e abertura de vagas devem ser conferidas operacionalmente, sem converter comunicação em regra clínica.

## Matriz por motivo — transcrição sintética fiel, não adicionar exigências

### 1. Cefaleia — impressa 31 / física 37
- Critérios: refratária à profilaxia APS por **mínimo dois meses**; indicação de investigação com RM/TC; imagem **ou EEG alterado**; necessidade de imagem RM/TC não disponível na APS; sinais de alerta (padrão novo/mudança recente, progressão insidiosa, despertar por dor, limitação de atividades, desencadeamento por esforço/tosse/Valsalva). O texto repete parcialmente a hipótese de investigação por imagem — preservar e sinalizar, sem criar duas exigências.
- **Avaliação clínica obrigatória:** exame físico neurológico.
- **Registro obrigatório:** diário de cefaleia/dor.
- **Se houver:** TC e RM de crânio. Não transformar EEG em obrigatório por aparecer no critério de exame alterado.
- Já existe registro específico `cefaleia-neuropediatria-20261016.json`; comparar estrutura em vez de duplicar.

### 2. Convulsão/Epilepsia — impressas 31–32 / físicas 37–38
- Critérios: um ou mais episódios sugestivos de crise, **exceto convulsão febril simples nesse critério**; epilepsia prévia sem controle sob monoterapia otimizada em dose plena e descartada má adesão; efeitos adversos intoleráveis; difícil controle mesmo com **duas ou mais** medicações anticrise em dose plena e descartada má adesão.
- **Avaliação clínica obrigatória:** exame neurológico (não equivale a EEG).
- **Se houver:** EEG, TC de crânio, RM de crânio.
- Já existe registro específico `convulsao-epilepsia-20261016.json`, regra `NEURO` `clinicalAssessment` obrigatória. Exibir nas telas e impressão; não inventar exames adicionais.

### 3. Atraso/Regressão do Desenvolvimento Neuropsicomotor — impressas 32–33 / físicas 38–39
- Critérios: ausência/perda de um ou mais marcos para idade; fraqueza ou hipotonia; paralisia cerebral; perímetro cefálico abaixo de -2 ou acima de +2 escore Z ao nascer, ou desaceleração de crescimento; alteração morfológica sugestiva de síndrome genética; TDL/atraso de linguagem; perda prévia de fala, marcha e/ou compreensão.
- **Obrigatórios:** relatório escolar e **exame físico neurológico** (avaliação clínica).
- **Se houver:** relatório de terapias, TC, RM, exames laboratoriais e genéticos.

### 4. TEA — impressa 33 / física 39
- Critérios: suspeita/diagnóstico de TEA; dismorfias/características sindrômicas sugestivas de síndrome associada; TEA com pais consanguíneos.
- **Aplicar pelo menos um** instrumento e informar resultado, respeitando faixa etária: M-CHAT 18–30 meses, AQ-10 4–11 anos, CARS-2 a partir de 2 anos. A fonte chama cada instrumento de “obrigatório” mas os introduz como alternativas **pelo menos um**; não exigir os três ao mesmo tempo.
- **Se diagnóstico prévio**, além dos itens anteriores: laudos médicos anteriores obrigatórios; relatórios multiprofissionais se houver; nomes das medicações em uso obrigatórios; EEG/neuroimagem anteriores se houver; relatório escolar atualizado obrigatório; **BERA obrigatório em casos de atraso de linguagem**.
- Não generalizar requisitos de diagnóstico prévio para apenas suspeita.

### 5. TDAH/TOD — impressas 34–35 / físicas 40–41
- Critérios descritos: suspeita/diagnóstico de TDAH; 4 a menos de 6 anos com pontuação positiva; a partir de 6 anos pontuação positiva e sintomas persistentes **após tratamento inicial em doses otimizadas por pelo menos 4 semanas**, com dificuldade de aprendizagem OU agitação/prejuízo em aulas/risco de dano OU dúvida diagnóstica por TEA. Não estender prazo de 4 semanas à faixa 4–6.
- **Para encaminhamento:** MTA-SNAP-IV, relatório médico com sintomas/contexto social e escolar, relatório escolar atualizado; BERA **se atraso de linguagem** (o documento o marca obrigatório nessa condição).
- **Se diagnóstico prévio**, além dos anteriores: laudos médicos prévios e nomes das medicações em uso obrigatórios; relatórios multiprofissionais e EEG/neuroimagem se houver; relatório escolar atualizado obrigatório (repetido na fonte). Preservar distinção entre documentos gerais e de diagnóstico prévio.

### 6. Transtornos Específicos da Aprendizagem — impressa 35 / física 41
- Critérios: suspeita/diagnóstico de transtorno de aprendizagem (dislexia, dislalia, discalculia e/ou dificuldade escolar) com alteração neurológica ou fenotípica; OU persistência **mais de 6 meses**, sem fator psicológico/socioambiental identificado.
- **Obrigatório:** relatório escolar atualizado; **audiometria quando houver suspeita de déficit auditivo ou atraso de linguagem**.
- **Se houver:** avaliação psicopedagógica/fonoaudiológica e neuropsicológica.
- **Se diagnóstico prévio:** laudos médicos anteriores e nomes das medicações obrigatórios; relatórios multiprofissionais e EEG/neuroimagem se houver; relatório escolar atualizado obrigatório.

### 7. Distúrbios do Movimento — impressas 35–36 / físicas 41–42
- Critérios: suspeita/diagnóstico de ataxia, coreia, distonia ou espasmo hemifacial.
- **Avaliação clínica obrigatória:** exame físico neurológico.
- **Se houver:** exames laboratoriais, TC, RM, eletroneuromiografia.

### 8. Doenças Neurológicas Inflamatórias — impressa 36 / física 42
- Critérios: suspeita/diagnóstico de esclerose múltipla, encefalomielite aguda disseminada, neurite óptica ou mielite transversa.
- **Avaliação clínica obrigatória:** exame físico neurológico.
- **Se houver:** exames laboratoriais, TC e RM.

## Regras de implementação e pendências
- Os **oito motivos** acima são da seção Neurologia Pediátrica; separar cada um no seletor por motivo. A mensagem geral não deve mostrar exames de uma condição como obrigatórios de outra.
- Apresentar grupos distintos: critérios para encaminhar; descrição clínica; avaliação clínica obrigatória; documentos obrigatórios; documentos condicionais; exames/documentos “se houver”; alertas/limites; origem com página.
- Em relatórios e listas de Recepção, conferir **presença**, não interpretar exame neurológico ou definir diagnóstico.
- Comparar a estrutura e renderer já implementados para Cefaleia e Convulsão antes de mudar. Manter conteúdo oficial e histórico das duas condições intactos.
- Confirmar por responsável a vigência/oferta atual e os pontos ambíguos (17 anos; TEA e instrumentos conforme idades); não aplicar decisões clínicas adicionais sem validação institucional.
- **Esta matriz é documentação de auditoria, não entrega das seis condições pendentes na interface**. Publicação exige implementação, testes de integridade e navegador, revisão clínica/institucional e CI.
