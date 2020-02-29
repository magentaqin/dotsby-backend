const { env } = process;

const {
  HOST,
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  JWT_SECRET_KEY,
} = env;

module.exports = {
  port: 8888,
  host: HOST || '127.0.0.1',
  db: {
    host: DATABASE_HOST || 'localhost',
    user: DATABASE_USER || 'root',
    database: DATABASE_NAME || 'dotsby',
    password: DATABASE_PASSWORD || '',
    port: DATABASE_PORT || 3306,
  },
  jwt_secret_key: JWT_SECRET_KEY || 'LNurHStisFDRqYX4DD2N8lPHy5eiyHvNOZkE2PHO',
}
