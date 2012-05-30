(function(){
  var util, pathutil, Walk, Reloader, Paths, signal, async, Log, Sync, ControllerSupport, __ref, __slice = [].slice;
  util = require('util');
  pathutil = require('path');
  __ref = require("./loader"), Walk = __ref.Walk, Reloader = __ref.Reloader, Paths = __ref.Paths;
  signal = require("./signal").signal;
  async = require("../magic").async;
  Log = require("../log").Log;
  Sync = require('sync');
  ControllerSupport = (function(){
    ControllerSupport.displayName = 'ControllerSupport';
    var prototype = ControllerSupport.prototype, constructor = ControllerSupport;
    function ControllerSupport(action){
      this.action = action;
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
    prototype.render = function(path, args){
      path == null && (path = this.id);
      console.log(this.id);
      return [JSON.stringify(constructor.views)];
    };
    return ControllerSupport;
  }());
  exports.ControllerLoader = function(dir){
    var out, file, __i, __ref, __len;
    out = new (function(){
      var prototype = constructor.prototype;
      prototype.reload = signal();
      function constructor(){}
      return constructor;
    }());
    for (__i = 0, __len = (__ref = Walk(dir)).length; __i < __len; ++__i) {
      file = __ref[__i];
      Reloader(file, __fn);
    }
    return out;
    function __fn(exp){
      var id, action, keys, __res, __ref;
      __res = [];
      for (id in __ref = Paths(exp)) {
        action = __ref[id];
        out[id] = action;
        __res.push(action.support.id = id);
      }
      keys = __res;
      return out.reload.fire(keys);
    }
  };
  exports.Controller = function(actions){
    var r, action, props;
    for (r in actions) {
      action = actions[r];
      props = __import({
        support: new ControllerSupport(actions[r])
      }, action);
      actions[r] = action.bind(props.support);
      __import(actions[r], props);
    }
    return actions;
  };
  exports.Controller.views = function(sys){
    return ControllerSupport.views = sys;
  };
  exports.action = function(spec, func){
    var out, __ref;
    __ref = spec instanceof Function
      ? [spec, {}]
      : [func, spec], func = __ref[0], spec = __ref[1];
    out = function(){
      var args, pass, param, type, __ref;
      args = __slice.call(arguments);
      if (arguments.length === 1 && typeof arguments[0] === 'object') {
        args = args[0];
      }
      pass = {};
      for (param in __ref = spec) {
        type = __ref[param];
        pass[param] = args[param] || args.shift();
      }
      return func.call(pass, this);
    };
    out.expects = spec;
    return out;
  };
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
