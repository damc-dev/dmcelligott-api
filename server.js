exports.start = function() {
  var restify = require('restify');
  var log = require('./lib/log');
  var appConfig = require('./config/appConfig');
  var tokenConfig = require('./config/tokenConfig');

  var user = require('./route/user');
  var jwt = require('restify-jwt');

  var server = restify.createServer({
    name: appConfig.name,
    version: appConfig.version,
    log: log
  });

  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());
  server.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
  });

  server.pre(function (req, res, next) {
    req.log.info({req: req}, 'START');
    return next();
  });

  server.post('/signup', user.signUp);
  server.post('/authenticate', user.authenticate);
  server.get('/me', jwt({secret: tokenConfig.jwt_secret}), user.me);

  server.listen(appConfig.port, function () {
    log.info('%s listening at %s', server.name, server.url);
  });

};
