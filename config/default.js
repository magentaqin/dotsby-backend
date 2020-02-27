module.exports = {
  productionEnvs: ['staging', 'production'],
  port: 4000,
  host: '127.0.0.1',
  apiPrefix: '/api/v1',
  jwt_secret_key: 'LNurHStisFDRqYX4DD2N8lPHy5eiyHvNOZkE2PHO',
  db: {
    host: 'localhost',
    user: 'root',
    database: 'dotsby',
    password: 'qm123456',
    port: 3306,
  },
}
