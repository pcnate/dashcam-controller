var SerialPort = require('serialport');
var port = new SerialPort("/dev/ttyACM0", {
  baudRate: 57600,
});

port.on('data', function( data ) {
  console.log( data.toString() );
});

port.on('error', function( err ) {
  console.log( err );
});
