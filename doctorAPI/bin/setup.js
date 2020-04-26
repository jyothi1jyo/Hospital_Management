'use strict';
const path = require('path');
const app = require(path.resolve(__dirname, '../server/server'));
const datasource = app.datasources.DoctorDB;
const migration = require(path.resolve(__dirname, './automigrate'));
const mockData = require(path.resolve(__dirname, './mockData'));

datasource.once('connected', () => {
  migration.doMigrate().then(() => {
    console.log('DB migration done');
    mockData.generateMockData().then(() =>{
      console.log('Dummy data generated successfully!');
      process.exit(0);
    });
  }).catch(err => {
    console.log(err);
  });
});
