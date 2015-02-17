var bunyan = require('bunyan');
var restify = require('restify');
var config = require('../config/logConfig');

function getLogger() {
    var restifyConfig = config;
    restifyConfig.serializers = restify.bunyan.serializers;
    return bunyan.createLogger(restifyConfig);
}

module.exports = getLogger();
