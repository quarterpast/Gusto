(function(){
  var Q, http, url, querystring, vm, fs, util, Sync, Router, status, HTTPStatus, Loader, Log, async, syncPromise, Timer, Server, __ref;
  Q = require('q');
  http = require('q-http');
  url = require('url');
  querystring = require('querystring');
  vm = require('vm');
  fs = require('fs');
  util = require('util');
  Sync = require('sync');
  Router = require("./router").Router;
  HTTPStatus = (status = require("./status")).HTTPStatus;
  Loader = require("../mvc/loader").Loader;
  Log = require("../log").Log;
  __ref = require("../magic"), async = __ref.async, syncPromise = __ref.syncPromise;
  Timer = require("../timer").Timer;
  exports.Server = Server = (function(){
    Server.displayName = 'Server';
    var prototype = Server.prototype, constructor = Server;
    Server.error = {};
    Server.lastError = false;
    Server.hijack = function(id, promise, err){
      var __this = this;
      err.previous = this.lastError;
      err.next = false;
      this.error[id] = err;
      if (this.lastError) {
        this.error[this.lastError].next = id;
      }
      this.lastError = id;
      return promise.then(function(){
        var __ref, __ref1;
        if (__this.error[id].previous) {
          __this.error[__this.error[id].previous].next = __this.error[id].next;
        }
        if (__this.error[id].next) {
          __this.error[__this.error[id].next].previous = __this.error[id].previous;
        }
        if (__this.lastError === id) {
          __this.lastError = __this.error[id].previous;
        }
        return __ref1 = (__ref = __this.error)[id], delete __ref[id], __ref1;
      });
    };
    prototype.serve = function(request){
      var out;
      out = Q.defer();
      Sync(function(){
        var time, get, post, o;
        time = new Timer(request.connection.remoteAddress + " " + request.path);
        if (constructor.lastError && constructor.error[constructor.lastError]) {
          return out.resolve(__import({
            headers: {
              "content-type": "text/html"
            },
            status: 200,
            onclose: __bind(time, 'end')
          }, constructor.error[constructor.lastError]));
        }
        return out.resolve(
        function(it){
          return it.toResponse(request, time);
        }(
        (function(){
          try {
            time.start('qs-parse');
            get = url.parse(request.url, true).query;
            post = request.method === 'POST' && request.headers["content-length"]
              ? querystring.parse(syncPromise(request.body.read()))
              : {};
            request.get = get;
            request.post = post;
            time.finish('qs-parse');
            time.start('routing');
            o = Router.route(request);
            time.finish('routing');
            return o;
          } catch (e) {
            time.start('error');
            Log.error(e.message);
            console.warn(e.stack);
            o = e instanceof HTTPStatus
              ? e
              : status[500]({
                wrap: e
              });
            time.finish('error');
            return o;
          }
        }())));
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
  function __bind(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
