// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8080;

function parseEnvList(env) {
  if (!env) {
    return [];
  }
  return env.split(',');
}

// For your personal proxy, we keep these empty = allow all
var originBlacklist = [];
var originWhitelist = [];

var cors_proxy = require('./lib/cors-anywhere');

cors_proxy.createServer({
  originBlacklist: originBlacklist,
  originWhitelist: originWhitelist,
  // Browser already sends Origin, but we don't force any header now
  requireHeader: [],
  // No rate limiting for your dev usage
  checkRateLimit: function () { return false; },
  removeHeaders: [
    'cookie',
    'cookie2',
    // Strip Heroku/host-specific headers
    'x-request-start',
    'x-request-id',
    'via',
    'connect-time',
    'total-route-time',
  ],
  redirectSameOrigin: true,
  httpProxyOptions: {
    // Do not add X-Forwarded-For, etc. headers, because some hosts already add it
    xfwd: false,
  },
}).listen(port, host, function() {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
});
