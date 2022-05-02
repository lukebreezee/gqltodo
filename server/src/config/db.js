const pg = require('pg')

module.exports = new pg.Pool({
  user: 'lukebreezee',
  host: 'localhost',
  port: 5432,
  database: 'graph_ql_todo',
})
