# Falcontec Refrigeração

Projeto desenvolvido para a disciplina de Desenvolvimento Front-End para Web. O site apresenta a Falcontec Refrigeração, seus serviços e uma área interna para gerenciamento e acompanhamento de ordens de serviço.

## Funcionalidades

- Conhecer a empresa e consultar os serviços oferecidos.
- Solicitar atendimento por meio de um formulário que prepara uma mensagem e abre o WhatsApp da empresa.
- Acessar a área técnica por meio de uma tela de login.
- Cadastrar técnicos e criar ordens de serviço pelo painel administrativo.
- Atribuir ordens de serviço aos técnicos.
- Visualizar as ordens atribuídas ao técnico.
- Atualizar o status das ordens de serviço.
- Consultar e filtrar ordens por informações e status no painel administrativo.
- Acompanhar o resumo das ordens de serviço por situação.

## Como executar

1. Baixe ou clone este repositório.
2. Abra a pasta `FalconTec`.
3. Acesse `FalconTec/html/index.html` no navegador.
4. Para acessar as áreas internas, utilize o link **Área do Técnico** disponível no site.

O projeto utiliza HTML, CSS e JavaScript e funciona diretamente no navegador, sem instalação de dependências.

## Estrutura

    Projeto_Final_FrontEnd/
    ├── FalconTec/
    │   ├── html/   Páginas do site, agendamento e painéis internos
    │   ├── css/    Estilos e responsividade
    │   ├── js/     Funcionalidades do site e gerenciamento das ordens
    │   └── img/    Logotipo e imagens utilizadas
    └── README.md

## Limitações conhecidas

- O projeto é uma demonstração Front-End, sem integração com servidor ou banco de dados.
- Os dados dos técnicos e das ordens de serviço são armazenados no navegador por meio do `localStorage`.
- A sessão de acesso utiliza `localStorage` ou `sessionStorage`, conforme a opção de manter o login.
- O formulário de agendamento abre o WhatsApp com uma mensagem preenchida. O envio da mensagem depende da confirmação do usuário no próprio WhatsApp.
- O login e o armazenamento de dados são demonstrativos e não oferecem segurança adequada para uso em produção.
- Os dados armazenados podem ser perdidos se o armazenamento do navegador for limpo ou se o projeto for acessado em outro navegador ou dispositivo.
