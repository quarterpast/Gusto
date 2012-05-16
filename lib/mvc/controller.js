(function(){
  var util, pathutil, Loader, Config, Log, async, Renderer, Sync, Controller, Controllers, _ref, __split = ''.split, __slice = [].slice;
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
        ? Renderer.resolve($.path($.id, action))
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
      var obj, last, part, act, _i, _len;
      obj = this.out;
      if (!(id instanceof Array)) {
        id = __split.call(id, '.');
      }
      last = id.pop();
      for (_i = 0, _len = id.length; _i < _len; ++_i) {
        part = id[_i];
        obj = obj[part] || (obj[part] = {});
      }
      act = __bind(obj, last);
      if (act instanceof Function) {
        return act;
      }
    };
    Controllers.register = function(klass, id){
      var out, action, fn, path;
      out = new klass;
      for (action in out) {
        fn = out[action];
        if (action in klass.prototype && !(action in Controller.prototype)) {
          path = _fn;
          fn.id = id;
          fn.path = path;
          fn.renderer = Renderer.resolve(path(id, action));
        }
      }
      return out;
      function _fn(id, action){
        return (__split.call(id, '.')).concat([action]).join('/');
      }
    };
    function _ctor(){} _ctor.prototype = prototype;
    function Controllers(){
      var _this = new _ctor;
      superclass.call(_this, Controllers.register);
      return _this;
    }
    prototype.run = function(){
      return superclass.prototype.run.call(this, Config.controllerPath);
    };
    return Controllers;
  }(Loader)));
  exports.action = function(spec, func){
    var out, _ref;
    _ref = spec instanceof Function
      ? [spec, {}]
      : [func, spec], func = _ref[0], spec = _ref[1];
    out = function(){
      var args, param, type, arg, _ref;
      args = __slice.call(arguments);
      if (arguments.length === 1 && typeof arguments[0] === 'object') {
        args = args[0];
      }
      for (param in _ref = spec) {
        type = _ref[param];
        arg = args[param] || args.shift();
        pass[param] = arg;
      }
      return func.call(pass, this['super']);
    };
    return out.expects = spec;
  };
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
