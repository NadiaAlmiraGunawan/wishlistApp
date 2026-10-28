import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

function createPool(): mysql.Pool {
  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT || "3306");
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (!host || !user || !password || !database) {
    throw new Error(
      "Konfigurasi database belum lengkap. Periksa DB_HOST, DB_USER, DB_PASSWORD, DB_NAME."
    );
  }

  const sslCaRaw = process.env.DB_SSL_CA;
  const useSsl = process.env.DB_SSL !== "false";

  return mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl: useSsl
      ? sslCaRaw
        ? { ca: sslCaRaw.replace(/\\n/g, "\n") }
        : { rejectUnauthorized: false }
      : undefined,
  });
}

export const pool = global._mysqlPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  global._mysqlPool = pool;
}

export async function query<T = any>(
  sql: string,
  params: any[] = []
): Promise<T> {
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}