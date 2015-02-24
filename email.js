var fs = require('fs');
var Hapi = require('hapi');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
  auth: {
    api_user: process.env.SENDGRID_USERNAME,
    api_key: process.env.SENDGRID_PASSWORD
  }
};

var client = nodemailer.createTransport(sgTransport(options));

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
    port: process.env.PORT
});

// Add the route
server.route({
    method: 'GET',
    path:'/{email}',
    handler: function (request, reply) {
      var email = {
        from: 'Control Gimnasio <info@control-gimnasio.com>',
        to: request.params.email,
        subject: 'Bienvenido a Control Gimnasio',
        html: fs.readFileSync('index.html', 'utf8')
      };

      client.sendMail(email, function(err, info){
          if (err){
            reply(err);
          }
          else {
            reply(info);
          }
      });
    }
});

// Start the server
server.start();
