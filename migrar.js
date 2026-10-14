
require("dotenv").config({ path: ".env.local" });

const Database = require("better-sqlite3");
const { Client } = require("pg");

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não encontrada no arquivo .env.local");
  }

  const sqlite = new Database("vendas.db", { readonly: true });
  const pg = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await pg.connect();
    console.log("Conectado ao PostgreSQL da Neon.");

    const clientes = sqlite.prepare(
      "SELECT id, nome, cidade FROM clientes ORDER BY id"
    ).all();

    const produtos = sqlite.prepare(
      "SELECT id, nome, preco FROM produtos ORDER BY id"
    ).all();

    const vendas = sqlite.prepare(
      "SELECT id, cliente_id, produto_id, quantidade, data_venda FROM vendas ORDER BY id"
    ).all();

    await pg.query("BEGIN");

    await pg.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY,
        nome TEXT NOT NULL,
        cidade TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY,
        nome TEXT NOT NULL,
        preco DOUBLE PRECISION NOT NULL
      );

      CREATE TABLE IF NOT EXISTS vendas (
        id INTEGER PRIMARY KEY,
        cliente_id INTEGER NOT NULL REFERENCES clientes(id),
        produto_id INTEGER NOT NULL REFERENCES produtos(id),
        quantidade INTEGER NOT NULL,
        data_venda TEXT NOT NULL
      );
    `);

    // Evita duplicação e permite executar a migração novamente.
    // A ordem respeita as chaves estrangeiras.
    await pg.query("DELETE FROM vendas");
    await pg.query("DELETE FROM produtos");
    await pg.query("DELETE FROM clientes");

    for (const c of clientes) {
      await pg.query(
        "INSERT INTO clientes (id, nome, cidade) VALUES ($1, $2, $3)",
        [c.id, c.nome, c.cidade]
      );
    }

    for (const p of produtos) {
      await pg.query(
        "INSERT INTO produtos (id, nome, preco) VALUES ($1, $2, $3)",
        [p.id, p.nome, p.preco]
      );
    }

    for (const v of vendas) {
      await pg.query(
        `INSERT INTO vendas
          (id, cliente_id, produto_id, quantidade, data_venda)
         VALUES ($1, $2, $3, $4, $5)`,
        [v.id, v.cliente_id, v.produto_id, v.quantidade, v.data_venda]
      );
    }

    await pg.query("COMMIT");

    console.log("\nMigração concluída. Contagens no PostgreSQL:");

    for (const tabela of ["clientes", "produtos", "vendas"]) {
      const resultado = await pg.query(
        `SELECT COUNT(*)::int AS total FROM ${tabela}`
      );
      console.log(`${tabela}: ${resultado.rows[0].total}`);
    }
  } catch (erro) {
    try {
      await pg.query("ROLLBACK");
    } catch (_) {}

    console.error("Falha na migração:", erro.message);
    process.exitCode = 1;
  } finally {
    sqlite.close();
    await pg.end().catch(() => {});
  }
}

main();
