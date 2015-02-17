var appConfig = require('./appConfig');
var config = {
      name: appConfig.name,
      streams: [{
        type: 'rotating-file',
        path: appConfig.logFile,
        period: '1d',   // daily rotation
        count: 4        // keep 3 back copies
      }, {
        stream: process.stdout,
        level: 'warn'
      }
    ]
  };

module.exports = config;
