var proxy = {
  to: function(baseUrl) {
    return function(req, res) {
      var callback, originRequest;
      callback = function(error, res, body) {
        console.log("in callback");
        return console.log("error=", error);
      };
      originRequest = requests(baseUrl + req.url, callback);
      req.pipe(originRequest);
      originRequest.pipe(res);
    };
  }
};

module.exports = proxy;
