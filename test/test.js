const mysql = require('mysql');
const assert = require('assert');
const lib = require('../index')


describe('mysql metadata', function () {
  this.timeout(0)
  var conn;
  var metadata;

  before(function (done) {
    conn = mysql.createConnection({
      host: "mysql.fornever.org",
      user: 'test',
      password: 'test998',
      multipleStatements: true
    })
    conn.connect(err => {
      if (err) throw err;
      done();
    })
  })

  beforeEach(function () {
    metadata = new lib.MySQLMetadata(conn);
  })

  it('connect test', function (done) {
    conn.queryAsync('SELECT 1 + 1 AS solution')
      .then(res => {
        assert.equal(res[0].solution, 2)
        done()
      })
      .catch(err => {
        throw err;
      })
  })

  it('show dbs', function (done) {
    metadata._dbs_names()
      .then(res => {
        assert.ok(res.length > 0)
        done();
      })
      .catch(err => {
        throw err
      })
  })


  it('show tables', function (done) {
    metadata._db_table_names('test')
      .then(res => {
        assert.ok(res)
        done();
      })
      .catch(err => {
        throw err;
      })
  });


  it('show desc', function (done) {
    metadata._table_desc('test', 'Products')
      .then(res => {
        assert.ok(res)
        done();
      })
      .catch(err => {
        throw err;
      })
  });

  it('database metadata', function (done) {
    metadata.dbMeta('test')
      .then(res => {
        assert.ok(res)
        done()
      })
      .catch(err => {
        throw err;
      })
  })


  it('all meta data', function (done) {
    metadata.allDbsMeta()
      .then(res => {
        assert.ok(res)
        done()
      })
      .catch(err => {
        throw err;
      })
  });


  after(function () {
    conn.end()
  })

});
