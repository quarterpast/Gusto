(function(){
  var util, pathutil, Loader, Config, Log, async, Renderer, Sync, Controller, Controllers, _ref, __split = ''.split;
  util = require('util');
  pathutil = require('path');
  Loader = require("./loader").Loader;
  _ref = require("../main"), Config = _ref.Config, Log = _ref.Log, async = _ref.async;
  Renderer = require("./renderer").Renderer;
  Sync = require('sync');
  exports.Controller = Controller = (function(){
    Controller.displayName = 'Controller';
    var prototype = Controller.prototype, constructor = Controller;
    prototype.renderJSON = function(it){
      return {
        status: 200,
        'content-type': "application/json",
        body: [JSON.stringify(it)]
      };
    };
    prototype.render = function(action, args){
      var $, rendered;
      $ = arguments.callee.caller;
      rendered = typeof action === 'string'
        ? Renderer($.path($.id, action))
        : (args = action, $.renderer);
      return [rendered.toString()];
    };
    function Controller(){}
    return Controller;
  }());
  exports.Controllers = new (Controllers = (function(superclass){
    Controllers.displayName = 'Controllers';
    var prototype = __extend(Controllers, superclass).prototype, constructor = Controllers;
    prototype.byId = function(id){
      var obj, part;
      obj = this.out;
      console.log(obj);
      if (!(id instanceof Array)) {
        id = __split.call(id, '.');
      }
      while (part = id.shift()) {
        obj = obj[part] || (obj[part] = {});
      }
      if (obj instanceof Function) {
        return obj;
      }
    };
    Controllers.register = function(klass){
      var out, action, fn, path;
      out = new klass;
      for (action in out) {
        fn = out[action];
        if (action in klass.prototype && !(action in Controller.prototype)) {
          path = _fn;
          fn.id = id;
          fn.path = path;
          fn.renderer = Renderer(path(id, action));
        }
      }
      return out;
      function _fn(id, action){
        return (__split.call(id, '.')).concat([action]).join('/');
      }
    };
    function walk(obj, cb){
      var k, v, _results = [];
      for (k in obj) {
        v = obj[k];
        if (typeof v === 'object') {
          _results.push(walk(v, cb));
        } else {
          _results.push(cb(v, k));
        }
      }
      return _results;
    }
    function _ctor(){} _ctor.prototype = prototype;
    function Controllers(){
      var _this = new _ctor;
      superclass.call(_this, function(ctrlrs){
        return walk(ctrlrs, Controllers.register);
      });
      return _this;
    }
    prototype.run = function(){
      return superclass.prototype.run.call(this, Config.controllerPath);
    };
    return Controllers;
  }(Loader)));
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
}).call(this);
