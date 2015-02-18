var request = require('request');
var httpProxy = require('http-proxy');


var proxyLib = {
  to: function(baseUrl) {
    var proxy = httpProxy.createProxyServer({xfwd: true});

    proxy.web(req, res, { target: baseUrl }, function(e) {
      console.log(e);
    });
    /*
    return function(req, res) {
      console.log("Proxying: " + req.url + " => " + baseUrl + req.url);
      var callback, originRequest;
      callback = function(error, res, body) {
        console.log(res);
        console.log(body);
        console.log("in callback");
        if (error) console.log(error);
        return ;
      };
      originRequest = request(baseUrl + req.url, callback);
      req.pipe(originRequest);
      originRequest.pipe(res);
    };
    */
  }
};

module.exports = proxyLib;
