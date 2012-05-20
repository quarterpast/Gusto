(function(){
  var util, pathutil, Loader, Config, Log, async, Renderer, Sync, Controller, Controllers, __ref, __split = ''.split, __slice = [].slice;
  util = require('util');
  pathutil = require('path');
  Loader = require("./loader").Loader;
  __ref = require("../main"), Config = __ref.Config, Log = __ref.Log, async = __ref.async;
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
      var obj, last, part, act, __i, __len;
      obj = this.out;
      if (!(id instanceof Array)) {
        id = __split.call(id, '.');
      }
      last = id.pop();
      for (__i = 0, __len = id.length; __i < __len; ++__i) {
        part = id[__i];
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
          path = __fn;
          fn.id = id;
          fn.path = path;
          fn.renderer = Renderer.resolve(path(id, action));
        }
      }
      return out;
      function __fn(id, action){
        return (__split.call(id, '.')).concat([action]).join('/');
      }
    };
    function Controllers(){
      var __this = this instanceof __ctor ? this : new __ctor;
      superclass.call(__this, Controllers.register);
      return __this;
    } function __ctor(){} __ctor.prototype = prototype;
    prototype.run = function(){
      return superclass.prototype.run.call(this, Config.controllerPath);
    };
    return Controllers;
  }(Loader)));
  exports.action = function(spec, func){
    var out, __ref;
    __ref = spec instanceof Function
      ? [spec, {}]
      : [func, spec], func = __ref[0], spec = __ref[1];
    out = function(){
      var args, param, type, arg, __ref;
      args = __slice.call(arguments);
      if (arguments.length === 1 && typeof arguments[0] === 'object') {
        args = args[0];
      }
      for (param in __ref = spec) {
        type = __ref[param];
        arg = args[param] || args.shift();
        pass[param] = arg;
      }
      return func.call(pass, this['super']);
    };
    out.expects = spec;
    return out;
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
