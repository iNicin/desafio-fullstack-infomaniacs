## EM DESENVOLVIMENTO...

# 📝 Task Manager API

API REST para gerenciamento de tarefas (tasks) com autenticação via JWT, desenvolvida com **Next.js (App Router)**, **TypeScript** e **MySQL**.

---

## 🚀 Tecnologias Utilizadas

- Next.js 16 (App Router / Route Handlers)
- TypeScript
- MySQL
- JWT (jsonwebtoken)
- bcryptjs
- Zod (validação de dados)
- mysql2

---

## 📂 Estrutura do Projeto

```
app/
└─ api/
   ├─ auth/
   │  ├─ register/route.ts
   │  └─ login/route.ts
   └─ tasks/
      ├─ route.ts          (GET / POST)
      └─ [id]/route.ts    (PATCH / DELETE)

lib/
├─ auth.ts
├─ jwt.ts
└─ db.ts

schemas/
├─ auth.schema.ts
└─ task.schema.ts

database/
└─ schema.sql
```

---

## ⚙️ Configuração do Ambiente

### 1️⃣ Clonar o projeto
```bash
git clone <url-do-repositorio>
cd task-manager
```

### 2️⃣ Instalar dependências
```bash
npm install
```

---

## 🔐 Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
JWT_SECRET=chave_super_secreta_grande_aqui_123456
JWT_EXPIRES_IN=2h

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=sua_senha
MYSQL_DATABASE=task_manager
```

⚠️ **Nunca versionar o `.env.local`**

Crie também um `.env.example`:

```env
JWT_SECRET=
JWT_EXPIRES_IN=

MYSQL_HOST=
MYSQL_PORT=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
```

---

## 🗄️ Banco de Dados

### Criar o banco
```sql
CREATE DATABASE task_manager;
```

### Rodar o schema
Arquivo: `database/schema.sql`

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo', 'done') DEFAULT 'todo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## ▶️ Rodar o Projeto

```bash
npm run dev
```

Servidor disponível em:
```
http://localhost:3000
```

---

## 🔑 Autenticação

A autenticação é feita via **JWT**.  
O token retornado no login deve ser enviado no header:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

-----


## 📌 Endpoints


----
Registrei a minha esposa
----

### 🔹 Registrar Usuário
`POST /api/auth/register`

```bash
curl -X POST "http://localhost:3000/api/auth/register" \
-H "Content-Type: application/json" \
-d '{"name":"Brunna","email":"brunna@test.com","password":"123456"}'
```

---

### 🔹 Login
`POST /api/auth/login`

```bash
curl -X POST "http://localhost:3000/api/auth/login" \
-H "Content-Type: application/json" \
-d '{"email":"brunna@test.com","password":"123456"}'
```

Resposta:
```json
{ "token": "JWT_TOKEN_AQUI" }
```

---

### 🔹 Listar Tasks
`GET /api/tasks`

```bash
curl -X GET "http://localhost:3000/api/tasks" \
-H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

### 🔹 Criar Task
`POST /api/tasks`

```bash
curl -X POST "http://localhost:3000/api/tasks" \
-H "Authorization: Bearer SEU_TOKEN_AQUI" \
-H "Content-Type: application/json" \
-d '{"title":"Minha task","description":"Descrição opcional"}'
```

---

### 🔹 Atualizar Task
`PATCH /api/tasks/:id`

```bash
curl -X PATCH "http://localhost:3000/api/tasks/1" \
-H "Authorization: Bearer SEU_TOKEN_AQUI" \
-H "Content-Type: application/json" \
-d '{"status":"done"}'
```

---

### 🔹 Deletar Task
`DELETE /api/tasks/:id`

```bash
curl -X DELETE "http://localhost:3000/api/tasks/1" \
-H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## ✅ Regras de Negócio

- Cada usuário só pode acessar suas próprias tasks
- Autenticação obrigatória em todas as rotas de tasks
- Validação de payload com Zod
- Sem uso de `any`
- Tokens JWT com expiração configurável

---

## 📌 Observações Técnicas

- Compatível com Next.js 16 / Turbopack
- Uso correto de rotas dinâmicas `[id]`
- Tratamento adequado de erros HTTP

---

## 👩‍💻 Autor

Desenvolvido por **Vinicius Ribeiro**  
Desafio técnico – API de gerenciamento de tarefas