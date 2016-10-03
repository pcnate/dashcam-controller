const fs = require("fs");

if( process.argv.indexOf('--configure') !== -1 ) {
  require('./configure.js');
  // console.log('running configuration');
  // require("process").exit();
} else

if( !fs.existsSync(".env") ) {
  console.log("No .env file");
  console.log("please run the configuration. node index.js --configure");
  console.log("exiting");
  require("process").exit();
} else {

require('dotenv').config();

var SerialPort = require('serialport');
var port = new SerialPort( process.env.serialPort, {
  baudRate: 57600,
});

var powerState = false;

/**
 *
 */
port.on('data', function( data ) {

  data = data.toString().replace(/[^\x20-\x7E]/gmi, '');

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

}
