# Portal de acesso por perfil

Arquitetura planejada em 11/08/2026.

- /login: autenticação
- /home: HUB após login
- /: área médica com protocolo oficial e pré-regulação Gemini
- /recepcao: conferência documental para recepção

A autenticação real é feita pelo Worker da Cloudflare. O repositório é público e, por isso, o controle de acesso do portal protege a experiência do site, mas não torna os arquivos do GitHub confidenciais. Para confidencialidade integral, os dados protegidos devem ser servidos por backend autenticado ou o repositório deve deixar de expor os arquivos publicamente.
