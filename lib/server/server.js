(function(){
  var Config, Log, async, Q, http, url, querystring, vm, fs, util, Sync, Router, Errors, Loader, Controller, SyncPromise, Timer, Server, _ref;
  _ref = require("../main"), Config = _ref.Config, Log = _ref.Log, async = _ref.async;
  Q = require('q');
  http = require('q-http');
  url = require('url');
  querystring = require('querystring');
  vm = require('vm');
  fs = require('fs');
  util = require('util');
  Sync = require('sync');
  _ref = require("./router"), Router = _ref.Router, Errors = _ref.Errors;
  Loader = require("../mvc/loader").Loader;
  Controller = require("../mvc/controller").Controller;
  SyncPromise = require("./syncpromise").SyncPromise;
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
      var time, get, post, route, action, params, data, res;
      time = new Timer(request);
      get = url.parse(request.url, true).query;
      post = request.method === 'POST' && request.headers["content-length"]
        ? querystring.parse(SyncPromise(request.body.read()))
        : {};
      route = this.router.route(request);
      if (!route) {
        return {
          status: 404,
          onclose: __bind(time, 'end')
        };
      }
      action = route.action, params = route.params;
      data = __import(__import(post, get), params);
      res = action(data);
      return __import({
        status: 200,
        onclose: __bind(time, 'end')
      }, 'forEach' in res ? {
        body: res
      } : res);
    };
    function Server(port, host){
      var _this = this;
      Sync(function(){
        _this.router = new Router;
        Loader(Config.controllerPath);
        Controller.prepare();
        _this.server = http.Server(__bind(_this, 'serve'));
        Log.log("listening on %s:" + port, host || "*");
        return _this.server.listen(port, host);
      });
    }
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
