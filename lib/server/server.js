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
      var time, get, post, found, route, action, params, data, res, __i, __ref, __len;
      time = new Timer(request);
      get = url.parse(request.url, true).query;
      post = request.method === 'POST' && request.headers["content-length"]
        ? querystring.parse(SyncPromise(request.body.read()))
        : {};
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
      data = __import(__import(post, get), params);
      res = action(data);
      return __import({
        status: 200,
        onclose: __bind(time, 'end')
      }, 'forEach' in res ? {
        body: res
      } : res);
    };
    prototype.error = function(e, r){
      if (e) {
        Log.error(e.message);
        return console.log(e.stack);
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
