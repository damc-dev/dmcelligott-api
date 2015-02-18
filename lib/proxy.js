var httpProxy = require('http-proxy');
var log = require('../lib/log');


var proxyLib = function proxy(options) {
  log.info(options);
  var options = options || {};
  var proxy = httpProxy.createProxyServer(options);

  var handler = function(req, res, next) {
    log.info('Handling: ' + req.url);

    options.rules.forEach(function(rule) {
      var regexp = rule.match || /[\s\S]*/;
      if ( req.url.match(regexp) ) {
        log.info('Proxy ' + req.url + ' => ' + rule.target);
        var target = rule.target || 'http://localhost:1337/';

        if (typeof router === 'function') {
          target = router(req);
        }
        proxy.web(req, res, {target: rule.target});
      }
    });
  };
  return handler;
};

module.exports = proxyLib;
