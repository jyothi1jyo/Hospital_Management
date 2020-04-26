'use strict';
const validator = require('validator');


module.exports = function(Users) {
    Users.appUserSignup = async(userData, callback) => {
        let user;
        const UserProfile = Users.app.models.UserProfile;
        const RoleMapping = Users.app.models.RoleMapping;
        if (!validator.isEmail(userData.email)) callback ({message: 'Invalid e-mail address', statusCode: 422});
        try {
            user = await createUserRecords(userData.email, userData.password, userData.username, 'active');
            await sendEmail(userData.email);
        } catch (err) {
            if (err.message.indexOf('Email already exists') !== -1) throw {message: 'Email in use!', status: 400, name: 'USER_SIGNUP_FAILED_EMAIL'};
            if (err.message.indexOf('User already exists') !== -1) throw {message: 'Username in use!', status: 400, name: 'USER_SIGNUP_FAILED_USERNAME'};
            throw err.message;
        }
        try {
            await RoleMapping.create({principalType: 'USER', principalId: user.id, roleId: 2});
        } catch (err) {
            await Users.deleteById(user.id);
            throw err;
        }
        try {
            const userProfile = await UserProfile.create({
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNo: userData.phoneNo,
                birthday: userData.birthday,
                gender: userData.gender,
                usersId: user.id,
            });
          } catch (err) {
            await Users.deleteById(user.id);
            throw err;
          }
        return user;
    };

    let createUserRecords = async(email, password, username, status) => {
        return Users.create({
        email: email,
        password: password,
        username: username,
        status: status,
        emailVerified: true,
        });
    };

    let sendEmail = async(email) => {
        return Users.app.models.Email.send({
            to: email,
            from: 'findYourDoctor123@gmail.com',
            subject: 'Account Created',
            text: 'Your account was created sucessfully',
            html: 'Your account was created sucessfully'
        });
    }
};
