(function(){
  var util, pathutil, Loader, Config, Log, async, Renderer, Controllers, Controller, _ref, __split = ''.split;
  util = require('util');
  pathutil = require('path');
  Loader = require("./loader").Loader;
  _ref = require("../main"), Config = _ref.Config, Log = _ref.Log, async = _ref.async;
  Renderer = require("./renderer").Renderer;
  exports.Controllers = new (Controllers = (function(superclass){
    Controllers.displayName = 'Controllers';
    var prototype = __extend(Controllers, superclass).prototype, constructor = Controllers;
    prototype.byId = function(id){
      var part;
      if (!(id instanceof Array)) {
        id = __split.call(id, '.');
      }
      part = id.shift();
      if (id.length === 0 && this[part] instanceof Function) {
        return __bind(this, part);
      } else {
        return arguments.callee.call(this[part], id);
      }
    };
    function Controllers(){
      superclass.call(this, Config.controllerPath, function(ctrlrs){
        return p(ctrlrs);
      });
    }
    return Controllers;
  }(Loader)));
  exports.Controller = Controller = (function(){
    Controller.displayName = 'Controller';
    var prototype = Controller.prototype, constructor = Controller;
    function Controller(){
      var k, v;
      for (k in this) {
        v = this[k];
        if (!(k in exports.Controller.prototype)) {
          v.id = [k];
        }
      }
    }
    Controller.subclasses = {};
    Controller.prepareAll = function(){
      var id, _results = [];
      for (id in this.subclasses) {
        _results.push(this.prepare(id));
      }
      return _results;
    };
    Controller.prepare = function(id){
      var sub, action, fn, path, _ref, _results = [];
      sub = this.subclasses[id];
      for (action in _ref = new sub) {
        fn = _ref[action];
        if (action in sub.prototype && !(action in this.prototype)) {
          path = _fn;
          _results.push((fn.id = id, fn.path = path, fn.renderer = Renderer(path(id, action)), fn));
        }
      }
      return _results;
      function _fn(id, action){
        return (__split.call(id, '.')).concat([action]).join('/');
      }
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
        ? Renderer($.path($.id, action))
        : (args = action, $.renderer);
      return [rendered.runInNewContext(args)];
    };
    return Controller;
  }());
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
