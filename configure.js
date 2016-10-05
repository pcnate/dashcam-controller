/**
 *
 */
const fs            = require("fs");
const prompt        = require("prompt");
const EventEmmitter = require("events");
const uuid          = require("node-uuid");

const configFilePath = ".env";
const GEN_ID = "Generate new ID";

// class PromptEmitter extends EventEmmitter {}
// const promptEmitter = new PromptEmitter();
//
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

/**
 *  check whether a configuration file already exists
 */
exports.configFileExists = () => {
  return fs.existsSync( configFilePath );
}

/**
 *
 */
exports.getConfig = () => {
  require('dotenv').config();

  let conf = {}

  for( const key in schema.properties  ) {
    conf[key] = schema.properties[key].default;
  }

  for( const key in schema.properties  ) {
    conf[key] = process.env[key];
  }

  return conf;

}

/**
 *  read the configuration into the schema object
 */
exports.readConfigFile = (next) => {

  require('dotenv').config();

  for( const key in schema.properties  ) {
    if( typeof schema.properties[key] === 'undefined' ) {
      schema.properties[key] = {};
    }
    schema.properties[key].default = process.env[key];

  }

  // promptEmitter.emit('startPrompt');
  if( typeof next === 'function' ) {
    next();
  }
};

/**
 * start the prompts
 */
exports.startPrompt = (next) => {

  prompt.start();

  /**
   *
   */
  prompt.get( schema, function( err, result ) {

    if( result.camID == GEN_ID ) {
      result.camID = uuid.v4();
    }

    let config = '';
    for( let key of Object.keys( result ) ) {
      config += key + '=' + result[key] + '\r\n';
    }

    fs.writeFileSync( configFilePath, config );
    console.log("\r\nConfig saved\r\n");

    require("process").exit();
  });

};

/**
 *  exit the application if no configuration file is found
 */
// if( fs.existsSync( configFilePath ) ) {
//   console.log("\r\nLoading existing configuration:\r\n");
//   promptEmitter.emit('readConfigFile');
// } else {
//   console.log("\r\nGenerating new configuration:\r\n");
//   promptEmitter.emit('startPrompt');
// }
