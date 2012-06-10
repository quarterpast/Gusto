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
    Server.error = {};
    Server.lasterr = false;
    Server.hijack = function(id, promise, err){
      var __this = this;
      err.previous = this.lasterr;
      err.next = false;
      this.error[id] = err;
      if (this.lasterr) {
        this.error[this.lasterr].next = id;
      }
      this.lasterr = id;
      return promise.then(function(){
        var __ref, __ref1;
        if (__this.error[id].previous) {
          __this.error[__this.error[id].previous].next = __this.error[id].next;
        }
        if (__this.error[id].next) {
          __this.error[__this.error[id].next].previous = __this.error[id].previous;
        }
        if (__this.lasterr === id) {
          __this.lasterr = __this.error[id].previous;
        }
        return __ref1 = (__ref = __this.error)[id], delete __ref[id], __ref1;
      });
    };
    prototype.serve = function(request){
      var out;
      out = Q.defer();
      Sync(function(){
        var time, res, get, post, route, routes, action, params, __ref;
        time = new Timer(request);
        if (constructor.lasterr && constructor.error[constructor.lasterr]) {
          return out.resolve(__import({
            headers: {
              "content-type": "text/html"
            },
            status: 200,
            onclose: __bind(time, 'end')
          }, constructor.error[constructor.lasterr]));
        }
        res = {};
        try {
          get = url.parse(request.url, true).query;
          post = request.method === 'POST' && request.headers["content-length"]
            ? querystring.parse(SyncPromise(request.body.read()))
            : {};
          request.get = get;
          request.post = post;
          routes = (__ref = Router.route(request).filter(function(it){
            return !(it instanceof NotFound);
          }), route = __ref[0], __ref);
          if (routes.length) {
            action = route.action, params = route.params;
            return res = action(params);
          } else {
            return out.resolve({
              status: 404,
              onclose: __bind(time, 'end'),
              body: ["404 " + request.path]
            });
          }
        } catch (e) {
          Log.error(e.message);
          console.log(e.stack);
          return res = {
            body: [e.message],
            status: 500
          };
        } finally {
          out.resolve(__import({
            headers: {
              "content-type": "text/html"
            },
            status: 200,
            onclose: __bind(time, 'end')
          }, 'forEach' in res ? {
            body: res
          } : res));
        }
      });
      return out.promise;
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
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
