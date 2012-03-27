(function(){
  var Config, Log, async, Q, http, url, querystring, vm, fs, util, Router, Errors, Loader, Controller, FutureStream, Timer, Server, _ref;
  _ref = require("../main"), Config = _ref.Config, Log = _ref.Log, async = _ref.async;
  Q = require('q');
  http = require('q-http');
  url = require('url');
  querystring = require('querystring');
  vm = require('vm');
  fs = require('fs');
  util = require('util');
  _ref = require("./router"), Router = _ref.Router, Errors = _ref.Errors;
  Loader = require("../mvc/loader").Loader;
  Controller = require("../mvc/controller").Controller;
  FutureStream = require("./syncstream").FutureStream;
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
    prototype.serve = function(request, response){
      var time, get, post, action, params, data, _ref;
      time = new Timer(request);
      get = url.parse(request.url, true).query;
      post = request.method === 'POST' && request.header["content-length"]
        ? FutureStream(this, request.header["content-length"]).out()
        : {};
      _ref = this.router.route(request), action = _ref.action, params = _ref.params;
      data = __import(__import(post, get), params);
      return {
        body: action,
        status: 200,
        onclose: __bind(time, 'end')
      };
    };
    function Server(port, host){
      Sync(function(){
        this.router = new Router;
        Loader(Config.controllerPath);
        this.server = http.Server(__bind(this, 'serve'));
        Log.log("listening on %s:" + port, host || "*");
        return this.server.listen(port, host);
      });
    }
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
