# Backend Test - Marketplace/Afiliados

Sistema de parceiros/vendas (estilo marketplace/afiliados) desenvolvido com NestJS, TypeScript e Prisma.

## 🛠 Stack Tecnológica

- **Node.js** v20+
- **NestJS** v10
- **TypeScript**
- **Prisma ORM**
- **SQLite** (banco de dados)
- **Docker** & Docker Compose

## 📋 Funcionalidades

### 1. Usuários

- ✅ Cadastro de usuários com validação
- ✅ Listagem de usuários
- ✅ Roles: ADMIN, PARTNER, CUSTOMER
- ✅ Email único

### 2. Produtos

- ✅ Cadastro de produtos
- ✅ Listagem de produtos
- ✅ Controle de status (ativo/inativo)

### 3. Vendas

- ✅ Registro de vendas
- ✅ Validação de roles (partner deve ser PARTNER, customer deve ser CUSTOMER)
- ✅ Relacionamento com produtos e usuários
- ✅ Listagem de vendas

### 4. Comissões

- ✅ Cálculo de comissão (10% do valor da venda)
- ✅ Total de vendas por parceiro
- ✅ Total de comissões por parceiro

### 5. Relatórios

- ✅ Relatório de vendas com filtros
- ✅ Filtros: data inicial, data final, parceiro
- ✅ Resumo com total de vendas e valor

## 🚀 Como Rodar o Projeto

### Opção 1: Com Docker (Recomendado)

```bash
# Construir e iniciar os containers
docker-compose up --build

# A aplicação estará disponível em http://localhost:3000
```

### Opção 2: Sem Docker

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Criar o banco de dados e executar migrations
npx prisma migrate dev --name init

# Popular o banco com dados de exemplo
npm run prisma:seed

# Iniciar a aplicação em modo desenvolvimento
npm run start:dev
```

## 📊 Banco de Dados

O projeto utiliza SQLite para simplicidade. O arquivo do banco fica em `prisma/dev.db`.

### Migrations

```bash
# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations
npx prisma migrate deploy

# Visualizar o banco de dados
npx prisma studio
```

### Seed

O projeto inclui um arquivo de seed com dados de exemplo:

```bash
npm run prisma:seed
```

Isso criará:

- 1 Admin
- 2 Parceiros
- 2 Clientes
- 3 Produtos
- 4 Vendas

## 🔌 Endpoints da API

### Usuários

```http
POST /users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "PARTNER"
}
```

```http
GET /users
```

### Produtos

```http
POST /products
Content-Type: application/json

{
  "name": "Curso de NestJS",
  "price": 299.90,
  "active": true
}
```

```http
GET /products
```

### Vendas

```http
POST /sales
Content-Type: application/json

{
  "productId": 1,
  "customerId": 2,
  "partnerId": 3,
  "value": 299.90
}
```

```http
GET /sales
```

### Comissões

```http
GET /partners/:id/commissions

Retorno:
{
  "partnerId": 1,
  "totalSales": 10,
  "totalCommission": 250.00
}
```

### Relatórios

```http
GET /reports/sales?startDate=2024-01-01&endDate=2024-12-31&partnerId=1
```

## 🏗 Arquitetura

O projeto segue os princípios do NestJS com separação clara de responsabilidades:

```
src/
├── prisma/              # Configuração do Prisma
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── users/               # Módulo de usuários
│   ├── dto/
│   │   └── create-user.dto.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── products/            # Módulo de produtos
├── sales/               # Módulo de vendas
├── partners/            # Módulo de comissões
├── reports/             # Módulo de relatórios
├── app.module.ts        # Módulo principal
└── main.ts              # Entry point
```

### Princípios seguidos:

- ✅ **DTOs** para validação de entrada
- ✅ **Controllers** apenas para roteamento
- ✅ **Services** contêm a lógica de negócio
- ✅ **Repository pattern** via Prisma
- ✅ **Validação** com class-validator
- ✅ **Tratamento de erros** adequado
- ✅ **Código limpo** e legível

## 💡 Decisões Técnicas

### 1. Por que SQLite?

- Simplicidade para ambiente de desenvolvimento
- Não requer instalação de servidor de banco
- Fácil de versionar e compartilhar
- Pode ser facilmente substituído por PostgreSQL ou MySQL

### 2. Por que Prisma?

- Type-safety completo
- Migrations automáticas
- Client gerado automaticamente
- Excelente DX (Developer Experience)
- Suporte a múltiplos bancos de dados

### 3. Estrutura de Módulos

Cada funcionalidade foi separada em seu próprio módulo para:

- Melhor organização
- Facilidade de manutenção
- Reutilização de código
- Testabilidade

### 4. Validação

- DTOs com class-validator para validação robusta
- Validações de negócio nos services
- Retorno de erros adequados (404, 400, 409)

### 5. Relacionamentos

- Uso de FKs no banco de dados
- Validações para garantir integridade referencial
- Include para carregar relacionamentos quando necessário

## 🧪 Testes

O projeto está preparado para testes. Exemplo de teste unitário para o UsersService:

```typescript
// users.service.spec.ts
import { Test } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";

describe("UsersService", () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should create a user", async () => {
    const user = {
      name: "Test User",
      email: "test@example.com",
      role: "CUSTOMER",
    };

    jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);
    jest.spyOn(prisma.user, "create").mockResolvedValue({
      id: 1,
      ...user,
      createdAt: new Date(),
    });

    const result = await service.create(user);
    expect(result.email).toBe(user.email);
  });
});
```

## 📄 Licença

MIT

---

Desenvolvido para teste técnico Backend
