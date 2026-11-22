# Digital Store — Back-end (API)

API RESTful desenvolvida em arquitetura MVC com **Node.js**, **Express**, **Sequelize** e **MySQL** para gerenciamento de usuários, categorias e produtos, com autenticação via **JWT**.

## Tecnologias Utilizadas

* **Node.js** & **Express**
* **Sequelize** (ORM)
* **MySQL / MariaDB**
* **JSON Web Token (`jsonwebtoken`)** & **bcrypt**
* **dotenv**

## Estrutura de Pastas

```text
Back/
├── src/
│   ├── config/        # Configuração de conexão com o banco (Sequelize)
│   ├── controllers/   # Regras de negócio (usuários, categorias e produtos)
│   ├── middleware/    # Middleware de autenticação JWT
│   ├── models/        # Modelos e associações do banco de dados
│   ├── routes/        # Definição das rotas da API
│   ├── app.js         # Configuração do Express e middlewares
│   └── server.js      # Inicialização do servidor
├── .env.example       # Modelo das variáveis de ambiente
└── package.json
```

## Pré-requisitos

* **Node.js** instalado (versão 18 ou superior recomendada)
* Servidor **MySQL** ou **MariaDB** em execução

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz da pasta `Back/` baseado no `.env.example` e preencha os campos abaixo:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `PORT` | Porta em que o servidor da API será iniciado | `3001` |
| `DB_HOST` | Endereço do servidor MySQL/MariaDB | `localhost` |
| `DB_PORT` | Porta do banco de dados (caso configurada) | `3306` |
| `DB_NAME` | Nome do banco de dados da aplicação | `digital_store` |
| `DB_USER` | Usuário de acesso ao banco de dados | `root` |
| `DB_PASSWORD` | Senha do usuário do banco de dados | `sua_senha` |
| `JWT_SECRET` | Chave secreta usada para assinar os tokens JWT | `sua_chave_secreta` |

## Instalação e Execução

1. **Acesse a pasta do back-end e instale as dependências:**
   ```bash
   cd Back
   npm install
   ```

2. **Crie o banco de dados no MySQL/MariaDB** com o mesmo nome definido em `DB_NAME` (ex.: `digital_store`).

3. **Configure o arquivo `.env`** conforme a tabela de variáveis acima.

4. **Inicie o servidor:**
   ```bash
   npm start
   ```

## Rotas da API

### Usuários e Autenticação

| Método | Rota | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `POST` | `/v1/user` | Cadastra um novo usuário | Pública |
| `GET` | `/v1/user/:id` | Retorna os dados de um usuário por ID | Pública |
| `POST` | `/v1/user/token` | Autentica o usuário e gera o token JWT | Pública |

### Categorias

| Método | Rota | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/category/search` | Lista e filtra categorias | Pública |
| `GET` | `/v1/category/:id` | Retorna uma categoria por ID | Pública |
| `POST` | `/v1/category` | Cria uma nova categoria | Token JWT (`Bearer`) |
| `PUT` | `/v1/category/:id` | Atualiza uma categoria existente | Token JWT (`Bearer`) |
| `DELETE` | `/v1/category/:id` | Remove uma categoria | Token JWT (`Bearer`) |

### Produtos

| Método | Rota | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/product/search` | Lista e filtra produtos | Pública |
| `GET` | `/v1/product/:id` | Retorna um produto por ID | Pública |
| `POST` | `/v1/product` | Cria um novo produto | Token JWT (`Bearer`) |
| `PUT` | `/v1/product/:id` | Atualiza um produto existente | Token JWT (`Bearer`) |
| `DELETE` | `/v1/product/:id` | Remove um produto | Token JWT (`Bearer`) |
