(function(){
  var util, pathutil, Loader, Config, Log, async, Renderer, Sync, ControllerSupport, Controller, Controllers, __ref, __slice = [].slice;
  util = require('util');
  pathutil = require('path');
  Loader = require("./loader").Loader;
  __ref = require("../main"), Config = __ref.Config, Log = __ref.Log, async = __ref.async;
  Renderer = require("./renderer").Renderer;
  Sync = require('sync');
  ControllerSupport = (function(){
    ControllerSupport.displayName = 'ControllerSupport';
    var prototype = ControllerSupport.prototype, constructor = ControllerSupport;
    function ControllerSupport(actions){
      this.actions = actions;
    }
    prototype.call = function(action, args){
      throw Error('unimplemented');
    };
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
    return ControllerSupport;
  }());
  exports.Controller = Controller = (function(){
    Controller.displayName = 'Controller';
    var prototype = Controller.prototype, constructor = Controller;
    function Controller(actions){
      var r, action, __this = this instanceof __ctor ? this : new __ctor;
      __this.actions = actions;
      for (r in actions) {
        action = actions[r];
        action.bind(new ControllerSupport(actions));
      }
      return __this;
    } function __ctor(){} __ctor.prototype = prototype;
    return Controller;
  }());
  exports.Controllers = Controllers = (function(superclass){
    Controllers.displayName = 'Controllers';
    var prototype = __extend(Controllers, superclass).prototype, constructor = Controllers;
    function Controllers(path){
      var __this = this instanceof __ctor ? this : new __ctor;
      __import(__this, superclass(path));
      return __this;
    } function __ctor(){} __ctor.prototype = prototype;
    return Controllers;
  }(Loader));
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
      return func.call(pass, this);
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
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
