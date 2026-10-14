# Cloud Database Migration — SQLite to PostgreSQL

Projeto de Engenharia de Dados que demonstra a migração de um banco de dados SQLite local para PostgreSQL na nuvem, utilizando Neon e Node.js.

# 🇧🇷 Português

## Sobre o projeto

Este projeto demonstra um processo de migração de dados de um banco SQLite local para um banco PostgreSQL hospedado na plataforma Neon.

O fluxo inclui conexão com os bancos, criação das tabelas de destino, transferência de registros, preservação dos relacionamentos e validação dos dados após a migração.

## Tecnologias utilizadas

- SQLite
- PostgreSQL
- Neon
- Node.js
- JavaScript
- pg
- better-sqlite3
- dotenv

## Estrutura do banco de dados

O banco possui três tabelas relacionadas:

- `clientes`: informações dos clientes.
- `produtos`: catálogo de produtos e preços.
- `vendas`: registros de vendas, quantidades, datas e chaves estrangeiras.

## Resultados

| Tabela | Registros migrados |
|---|---:|
| Clientes | 3 |
| Produtos | 3 |
| Vendas | 5 |
| Total | 11 |

Após a migração, uma consulta SQL foi executada diretamente no PostgreSQL da Neon para verificar os dados e os relacionamentos entre clientes, produtos e vendas.

## Como executar

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar as variáveis de ambiente

Configure o arquivo `.env.local` com a variável `DATABASE_URL` fornecida pela Neon.

Nunca publique esse arquivo nem compartilhe sua string de conexão.

### 3. Preparar o banco SQLite

Coloque o arquivo `vendas.db` na pasta do projeto. Ele deve conter as tabelas `clientes`, `produtos` e `vendas`.

### 4. Executar a migração

```bash
node migrar.js
```

O script transfere os registros para o PostgreSQL e exibe a contagem final de cada tabela.

**Atenção:** o script atual substitui os dados existentes nessas três tabelas no banco PostgreSQL de destino. Utilize-o somente em um banco de testes ou após confirmar que os dados existentes podem ser substituídos.

## Segurança

- Arquivos `.env` e `.env.local` devem permanecer privados.
- Bancos SQLite locais são excluídos do Git.
- Credenciais de acesso não devem ser incluídas no código-fonte.

---

# 🇺🇸 English

## About the project

This project demonstrates a data migration workflow from a local SQLite database to a cloud-hosted PostgreSQL database on Neon.

The workflow includes database connections, destination table creation, record transfer, relationship preservation, and post-migration data validation.

## Technologies

- SQLite
- PostgreSQL
- Neon
- Node.js
- JavaScript
- pg
- better-sqlite3
- dotenv

## Database structure

The database contains three related tables:

- `clientes`: customer information.
- `produtos`: product catalog and prices.
- `vendas`: sales records, quantities, dates, and foreign keys.

## Results

| Table | Migrated records |
|---|---:|
| Customers (`clientes`) | 3 |
| Products (`produtos`) | 3 |
| Sales (`vendas`) | 5 |
| Total | 11 |

After migration, an SQL query was executed directly against Neon PostgreSQL to validate the records and the relationships between customers, products, and sales.

## How to run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Configure `.env.local` with the `DATABASE_URL` provided by Neon.

Never publish this file or expose your database connection string.

### 3. Prepare the SQLite database

Place `vendas.db` in the project directory. It must contain the `clientes`, `produtos`, and `vendas` tables.

### 4. Run the migration

```bash
node migrar.js
```

The script transfers the records to PostgreSQL and prints the final row count for each table.

**Warning:** the current script replaces existing data in the three destination tables. Use it only with a test database or after confirming that the existing data can be replaced.

## Security

- Keep `.env` and `.env.local` private.
- Local SQLite database files are excluded from Git.
- Never include database credentials in source code.
