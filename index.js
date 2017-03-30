const bluebird = require('bluebird')
const _ = require('lodash')

class MySQLMetadata {

  constructor(conn) {
    this._conn = bluebird.promisifyAll(conn)
  }

  async _table_desc(db_name, table_name) {
    const tmp = await this._conn.queryAsync(`use ${db_name}; desc ${table_name}`)
    return JSON.parse(JSON.stringify(tmp[1]))
  }

  async _db_table_names(db_name) {
    const tmp = await this._conn.queryAsync(`use ${db_name}; show tables`)
    return _.map(tmp[1], row => _.values(row)[0])
  }

  async _dbs_names() {
    const tmp = await this._conn.queryAsync('show databases;')
    return _.map(tmp, row => _.values(row)[0])
  }

  async dbMeta(db_name) {
    let r = { database: db_name, tables: {} }
    const tables_name = await this._db_table_names(db_name);
    for (let table_name of tables_name) {
      r.tables[table_name] = await this._table_desc(db_name, table_name)
    }
    return r;
  }

  async allDbsMeta() {
    const r = []
    const dbs_name = await this._dbs_names();
    for (let db_name of dbs_name) {
      r.push(await this.dbMeta(db_name))
    }
    return r
  }

  async pathMeta(path = "") {
    const path_arr = path.split('.')
    const db_name = path_arr[0];
    const table_name = path_arr[1];
    switch (path.length) {
      case 1:
        return await this.dbMeta(db_name)
      case 2:
        return await this._table_desc(db_name, table_name)
      default:
        throw new Error("param error, with param like 'db_name.table_name'")
        break;
    }
  }

}

module.exports = {
  MySQLMetadata
}
