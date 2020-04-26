'use strict';

const path = require('path');
// loopback server object
const app = require(path.resolve(__dirname, '../server/server'));
const dataSource = app.datasources.DoctorDB;

// check if the datasource is created and connected
dataSource.once('connected', () => {
  doUpdate();
});

function doUpdate() {
  dataSource.autoupdate((err, result) => {
    if (err) throw err;
    console.log('Models are updated');
    process.exit(0);
  });
}
