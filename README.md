API REST de Catálogo de Mídias

Sobre

API RESTful em Node.js, Express e MongoDB para gerenciar o CRUD (Criar, Ler, Atualizar, Eliminar) de quatro entidades: Autores, Livros, CDs e DVDs.

A arquitetura respeita as seguintes regras de acesso:

Leitura (GET): Acesso Público.

Modificação (POST, PUT, DELETE): Acesso Restrito e Autenticado.

Setup e Execução

Pré-requisitos

Node.js e npm instalados.

Servidor MongoDB ativo na porta padrão 27017.

Passos

Instalar Módulos: Na pasta raiz, execute npm install.

Executar API: Inicie o servidor com npm start.

A API estará em http://localhost:3000.

Endpoints e Segurança

Todos os endpoints começam com /autores, /livros, /cds, ou /dvds.

1. Acesso Público (Leitura)

Use o método GET em qualquer rota para listar ou buscar um recurso específico.

Exemplo: GET http://localhost:3000/livros

2. Acesso Autenticado (Escrita)

Para POST, PUT e DELETE, use HTTP Basic Authentication.

Credenciais:

Usuário: admin

Senha: password

Uso: Envie o cabeçalho Authorization com o valor codificado:

Authorization: Basic YWRtaW46cGFzc3dvcmQ=


Frontend

O cliente de interface (frontend) é uma aplicação React que consome esta API através de http://localhost:5173/, utilizando as credenciais de autenticação acima para todas as operações de modificação.