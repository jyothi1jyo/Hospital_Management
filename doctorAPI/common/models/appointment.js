'use strict';
const moment = require( 'moment' );

module.exports = function(Appointment) {
    Appointment.afterRemote('create', async function(ctx) {
        const usersId = ctx.args.data.usersId;
        // console.log('usersId', usersId);
        const Users = Appointment.app.models.Users;

        let user = await Users.findById(usersId);
        // console.log('user', user);
        const subject = 'Appointment booked';
        const msg = 'Your appointment was booked successfully';
        await sendEmail(user.email, msg, subject);
      });

    Appointment.afterRemote('deleteById', async function(ctx) {
        // console.log('ctx.args', ctx.args.options.accessToken.userId);
        const usersId = ctx.args.options.accessToken.userId;
        // console.log('usersId', usersId);
        const Users = Appointment.app.models.Users;

        let user = await Users.findById(usersId);
        console.log('user', user);
        const subject = 'Appointment cancelled';
        const msg = 'Your appointment was cancelled successfully';
        await sendEmail(user.email, msg, subject);
      });

      let sendEmail = async(email, message, subject) => {
        return Appointment.app.models.Email.send({
            to: email,
            from: 'findYourDoctor123@gmail.com',
            subject,
            text: message,
            html: message
        });
    }

    Appointment.beforeRemote('create', async function(ctx) {
      const data = ctx.args.data;
      const Doctor = Appointment.app.models.Doctor;
      const DoctorAvailablityStart = await Doctor.findById(data.doctorId);
      const appointmentTime = moment(data.start);
      if (DoctorAvailablityStart) {
      
        var startTime = moment(DoctorAvailablityStart.openningHrsFrom).local().format().split("T")[1];
        var endTime = moment(DoctorAvailablityStart.openningHrsTo).local().format().split("T")[1]

        let startDate = moment(data.start);
        startDate = startDate.set({hour:startTime.split(":")[0],minute:startTime.split(":")[1],second:startTime.split(":")[2],millisecond:0})
      
        let endDate = moment(data.start);
        endDate = endDate.set({hour:endTime.split(":")[0],minute:endTime.split(":")[1],second:endTime.split(":")[2],millisecond:0})
      
        let valid = startDate <= appointmentTime && endDate >= appointmentTime
        console.log('valid', valid);
        if (!valid) {
          throw ({message: "Sorry, this doctor is not available on the time you selected", statusCode: 401, code: 'APPOINTMENT_FULL'});
        }
        // Check doctor availablity timing
        // throw ({message: "Sorry, this time slot not available", statusCode: 401, code: 'APPOINTMENT_FULL'});
      }
      const Appointments = await Appointment.find({
        where: {
          end: {gt: data.start},
          doctorId: data.doctorId
        }
      });

      if (Appointments.length > 0) {
        throw ({message: "Sorry, this time slot not available", statusCode: 401, code: 'APPOINTMENT_FULL'});
      }

    });
};
