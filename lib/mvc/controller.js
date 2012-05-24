(function(){
  var util, pathutil, Loader, async, Log, Sync, ControllerSupport, __slice = [].slice;
  util = require('util');
  pathutil = require('path');
  Loader = require("./loader").Loader;
  async = require("../magic").async;
  Log = require("../log").Log;
  Sync = require('sync');
  ControllerSupport = (function(){
    ControllerSupport.displayName = 'ControllerSupport';
    var prototype = ControllerSupport.prototype, constructor = ControllerSupport;
    ControllerSupport.instances = [];
    function ControllerSupport(controller, action){
      this.controller = controller;
      this.action = action;
      constructor.instances.push(this);
      action.support = this;
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
      return ['implement!'];
    };
    return ControllerSupport;
  }());
  exports.Controller = function(actions){
    var r, action;
    for (r in actions) {
      action = actions[r];
      action.bind(new ControllerSupport(this, action));
    }
    return actions;
  };
  exports.Controller.views = function(sys){
    var cs, __i, __ref, __len, __results = [];
    for (__i = 0, __len = (__ref = ControllerSupport.instances).length; __i < __len; ++__i) {
      cs = __ref[__i];
      __results.push(cs.views = sys);
    }
    return __results;
  };
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
}).call(this);
