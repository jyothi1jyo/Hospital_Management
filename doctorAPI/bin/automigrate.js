'use strict';
const path = require('path');
// loopback server object
const app = require(path.resolve(__dirname, '../server/server'));
const dataSource = app.datasources.DoctorDB;

function doMigrate() {
  return dataSource.automigrate();
}

module.exports = {
  doMigrate: doMigrate,
};
