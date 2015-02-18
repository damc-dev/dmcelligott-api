var httpProxy       = require('http-proxy');
var proxy           = new httpProxy.RoutingProxy();
var restify         = require('restify');
var server          = restify.createServer();
var jwt = require('restify-jwt');
var helloWorldApiUrl = 'http://localhost:1337';

server.get('/foo/:bar', function(req, res) {
    proxy.proxyRequest(req, res, {
        host: 'somehost.com',
        port: 80
    });
});

server.get('/api/request', function(req, res) {
    proxy.proxyRequest(req, res, {
        host: 'somehost.com',
        port: 80
    });
});


/*
But there is one pretty big reason why this didn't work for me. Later on in the code I have some restify middleware code:
*/

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.gzipResponse());

/*
The reason this causes a problem is that the middleware calls are modifying the request object
in a way that prevents the ability of http-proxy to forward the request. In order for the proxy
to work, we can't mess with the request too much. I still needed this middleware for my existing
non-proxy API calls, so I created the following wrapper to conditionally implement each middleware:
*/

var wrapper = function(middleware) {
    return function(req, res, next) {
        var regex = /^\/foo.*$/;

        // if url is a proxy request, don't do anything and move to next middleware
        if(regex.test(req.url)) {
            next();
        }
        // else invoke middleware
        else {
            // some middleware is an array (ex. bodyParser)
            if(middleware instanceof Array) {
                middleware[0](req, res, function() {
                    middleware[1](req, res, next);
                });
            }
            else {
                middleware(req, res, next);
            }
        }
    };
};

// then I wrap my middleware calls with this function:
server.use(wrapper(restify.acceptParser(server.acceptable)));
server.use(wrapper(restify.authorizationParser()));
server.use(wrapper(restify.queryParser()));
server.use(wrapper(restify.bodyParser({ mapParams: false })));
server.use(wrapper(restify.gzipResponse()));
