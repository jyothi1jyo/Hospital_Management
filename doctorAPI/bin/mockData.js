'use strict';

const path = require('path');
//loopback server object
const app = require(path.resolve(__dirname, '../server/server'));
//datasource object
const ds = app.dataSources.DoctorDB;

async function generateMockData() {
  //require needed models
  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;
  const Users = app.models.Users;
  const UserProfile = app.models.UserProfile;
  //create roles
  const adminRole = await Role.create({name: 'admin', description: 'Admin for Doctor'});
  const appUserRole = await Role.create({name: 'appUser', description: 'Appuser for Doctor'});
  // create admin user
  const adminUserData = {username: 'admin', password: 'admin', email: 'admin@gmail.com', status: 'enabled', emailVerified: true};
  const adminUser = await Users.create(adminUserData);
  // assign admin role
  const adminRoleMappingData = {principalType: RoleMapping.USER, principalId: adminUser.id};
  await adminRole.principals.create(adminRoleMappingData);

  // create app user
  const appUserData = {username: 'appuser', password: 'appuser', email: 'appuser@gmail.com', status: 'enabled', emailVerified: true};
  const appUser = await Users.create(appUserData);
  // assign appuser role
  const appUserMappingData = {principalType: RoleMapping.USER, principalId: appUser.id};
  await appUserRole.principals.create(appUserMappingData);

  // create admin profile
  const adminProfileData = {firstName: 'Admin', lastName: 'User', phoneNo: '+911234567890', birthday: '1991-01-17T05:08:18.769Z',
    gender: 'Male', usersId: adminUser.id};
  const adminProfile = await UserProfile.create(adminProfileData);

  // create appuser profile
  const appUserProfileData = {firstName: 'App', lastName: 'User', phoneNo: '+91987654321', birthday: '1991-01-17T05:08:18.769Z',
    gender: 'Male', usersId: appUser.id};
  const appUserProfile = await UserProfile.create(appUserProfileData);
}
module.exports = {
  generateMockData: generateMockData,
};
