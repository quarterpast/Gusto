(function(){
  var Config, Log, Q, http, url, querystring, vm, fs, util, Router, Errors, Loader, Controller, Timer, Server, _ref;
  _ref = require("../main"), Config = _ref.Config, Log = _ref.Log;
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
    prototype.readPost = function(request){
      if (request.method === 'POST') {
        return request.body.read().then(function(body){
          return querystring.parse(body);
        });
      } else {
        return Q.when({});
      }
    };
    prototype.serve = function(request){
      var time, get, post, _this = this;
      time = new Timer(request);
      get = url.parse(request.url, true).query;
      post = this.readPost(request);
      return this.contPr.then(function(){
        var action, params, data, _ref;
        _ref = _this.router.route(request), action = _ref.action, params = _ref.params;
        data = post.then(function(res){
          return __import(__import(res, get), params);
        });
        return {
          body: action(data),
          status: 200,
          onclose: __bind(time, 'end')
        };
      });
    };
    function Server(port, host){
      this.router = new Router;
      this.controllers = new Loader(Config.controllerPath, __bind(Controller, 'prepare'));
      this.contPr = this.controllers.traverse();
      this.server = http.Server(__bind(this, 'serve'));
      Log.log("listening on %s:" + port, host || "*");
      this.server.listen(port, host);
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
