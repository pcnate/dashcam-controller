console.log('running configuration');


/**
 *
 */
const fs            = require("fs");
const prompt        = require("prompt");
const EventEmmitter = require("events");
const uuid          = require("node-uuid");

const configFilePath = ".env";
const GEN_ID = "Generate new ID";

class PromptEmitter extends EventEmmitter {}
const promptEmitter = new PromptEmitter();

// default values
var schema = {
  properties: {
    webServerEnabled: {
      'default': 'y',
      'require': true
    },
    webServerPort: {
      'default': 3000,
      'require': true
    },
    upload: {
      'default': 'y',
      'require': true
    },
    uploadAddress: {
      'default': 'http://example.com:3000/',
      'required': true
    },
    serialPort: {
      'default': "/dev/ttyACM0",
      'required': true
    },
    camID: {
      'default': GEN_ID,
      'required': true
    }
  }
};

//
// Start the prompt
//
promptEmitter.on('readConfigFile', function() {

  require('dotenv').config();

  for( const key in schema.properties  ) {
    if( typeof schema.properties[key] === 'undefined' ) {
      schema.properties[key] = {};
    }
    schema.properties[key].default = process.env[key];

  }

  promptEmitter.emit('startPrompt');

});

//
// Start the prompt
//
promptEmitter.on('startPrompt', function() {

  prompt.start();

  //
  // Get two properties from the user: username and email
  //
  prompt.get( schema, function( err, result ) {

    if( result.deviceID == GEN_ID ) {
      result.deviceID = uuid.v4();
    }

    let config = '';
    for( let key of Object.keys( result ) ) {
      config += key + '=' + result[key] + '\r\n';
    }

    fs.writeFileSync( configFilePath, config );
    console.log("\r\nConfig saved\r\n");

    require("process").exit();
  });

});

/**
 *  exit the application if no configuration file is found
 */
if( fs.existsSync( configFilePath ) ) {
  console.log("\r\nLoading existing configuration:\r\n");
  promptEmitter.emit('readConfigFile');
} else {
  console.log("\r\nGenerating new configuration:\r\n");
  promptEmitter.emit('startPrompt');
}
