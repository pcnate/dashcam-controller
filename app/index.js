const fs = require("fs");
const config = require('./configure.js');

if( process.argv.indexOf('--configure') !== -1 ) {
  // console.log('running configuration');
  // require("process").exit();
  if( config.configFileExists() ) {
    console.log("\r\nLoading existing configuration:\r\n");
    config.readConfigFile(config.startPrompt);
  } else {
    console.log("\r\nGenerating new configuration:\r\n");
    config.startPrompt();
  }

} else

if( !fs.existsSync(".env") ) {
  console.log("No .env file");
  console.log("please run the configuration. node index.js --configure");
  console.log("exiting");
  require("process").exit();
} else {

  require('dotenv').config();

  var SerialPort = require('serialport');
  console.log('connecting to serial port', process.env.serialPort );
  var port = new SerialPort( process.env.serialPort, {
    baudRate: 57600,
  });

  var powerState = false;

  var socket = {};
  var serialHistory = [];

  /**
   *
   */
  port.on('data', function( data ) {

    data = data.toString().replace(/[^\x20-\x7E]/gmi, '');

    serialHistory.unshift({ direction: 'rx', message: data });
    if( typeof socket.emit === 'function' ) {
      socket.emit('newSerial', { direction: 'rx', message: data });
    }

    if( data === "POWER_ON" ) {
      powerState = true;
    }

    if( data === "POWER_OFF" ) {
      powerState = false;
    }

  });

  port.on('error', function( err ) {
    console.log( err );
  });

  var express = require('express');
  var app = express();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);

  io.on('connection', function( sock ) {
    socket = sock;
    console.log('client connected');

    socket.on('command', function( command ) {
      if( command.action ) {
        switch (command.action) {
          case 'loadSettings':
            socket.emit('settings', config.getConfig() );
            break;
          case 'loadSerial':
            socket.emit('serial', serialHistory );
            break;
          case 'newSerial':
            if( typeof port.write === 'function' ) {
              serialHistory.unshift( command.serial );
              port.write( command.serial.message, ( err ) => {
                if( err ) {
                  return console.log( 'Error on write: ', err.message );
                }
              })
            }
            break;
          default:

        }
      } else {
        console.log('command', command );
      }
    })

    socket.on('disconnect', function() {
      socket = {};
    })
  })

  app.use('/node_modules', express.static( __dirname + '/../node_modules' ) );
  app.use('/css',          express.static( __dirname + '/../webapp/css'   ) );
  app.use('/js',           express.static( __dirname + '/../webapp/js'    ) );
  app.use('/views',        express.static( __dirname + '/../webapp/views' ) );

  // root index
  app.get(['/','/serial','/settings','/about'], function( req, res ) {
    res.sendFile('webapp/index.html', { root: __dirname + '/../' });
  })

  http.listen( process.env.webServerPort, function() {
    console.log('listening on port', process.env.webServerPort );
  });

}
