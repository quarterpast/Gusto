(function(){
  var Q, http, url, querystring, vm, fs, util, Sync, Router, NotFound, Loader, Log, async, SyncPromise, Timer, Server, __ref;
  Q = require('q');
  http = require('q-http');
  url = require('url');
  querystring = require('querystring');
  vm = require('vm');
  fs = require('fs');
  util = require('util');
  Sync = require('sync');
  __ref = require("./router"), Router = __ref.Router, NotFound = __ref.NotFound;
  Loader = require("../mvc/loader").Loader;
  Log = require("../log").Log;
  __ref = require("../magic"), async = __ref.async, SyncPromise = __ref.SyncPromise;
  Timer = (function(){
    Timer.displayName = 'Timer';
    var prototype = Timer.prototype, constructor = Timer;
    function Timer(req){
      this.id = req.connection.remoteAddress + " " + req.path;
      this.start = new Date;
    }
    prototype.end = function(){
      this.finish = new Date;
      return Log.log(this.id + ": " + (this.finish - this.start) + "ms");
    };
    return Timer;
  }());
  exports.Server = Server = (function(){
    Server.displayName = 'Server';
    var prototype = Server.prototype, constructor = Server;
    prototype.serve = function(request){
      var time, get, post, found, route, action, params, res, __i, __ref, __len;
      time = new Timer(request);
      try {
        get = url.parse(request.url, true).query;
        post = request.method === 'POST' && request.headers["content-length"]
          ? querystring.parse(SyncPromise(request.body.read()))
          : {};
        request.get = get;
        request.post = post;
        found = false;
        for (__i = 0, __len = (__ref = Router.route(request)).length; __i < __len; ++__i) {
          route = __ref[__i];
          if (!(route instanceof NotFound)) {
            found = true;
            action = route.action, params = route.params;
            break;
          }
        }
        if (!found) {
          return {
            status: 404,
            onclose: __bind(time, 'end')
          };
        }
        return res = action(params);
      } catch (e) {
        Log.error(e);
        return res = {
          body: [e.message],
          status: 500
        };
      } finally {
        __import({
          headers: {
            "content-type": "text/html"
          },
          status: 200,
          onclose: __bind(time, 'end')
        }, 'forEach' in res ? {
          body: res
        } : res);
      }
    };
    function Server(){
      this.server = http.Server(__bind(this, 'serve'));
    }
    prototype.listen = function(port, host){
      Log.log("listening on %s:" + port, host || "*");
      return this.server.listen(port, host);
    };
    return Server;
  }());
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
