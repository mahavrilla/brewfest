var deployd = require('deployd');
 
// configure database etc. 
var server = deployd({
  port: process.env.PORT || 5000,
  env: 'development',
  db: {
    host: 'oceanic.mongohq.com',
    port: 10071,
    name: 'app23490174',
    credentials: {
      username: 'heroku',
      password: '22767b9fd645bf0cb5adb4c8c4add817'
    }
  }
});
 
// heroku requires these settings for sockets to work
server.sockets.manager.settings.transports = ["xhr-polling"];
 
// start the server
server.listen();
 
// debug
server.on('listening', function() {
  console.log("Server is listening on port: " + process.env.PORT);
});
 
// Deployd requires this
server.on('error', function(err) {
  console.error(err);
  process.nextTick(function() { // Give the server a chance to return an error
    process.exit();
  });
});
