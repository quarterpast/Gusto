(function(){
  var util, pathutil, Log, async, Renderer, Controller, _ref, __split = ''.split;
  util = require('util');
  pathutil = require('path');
  _ref = require("../main"), Log = _ref.Log, async = _ref.async;
  Renderer = require("./renderer").Renderer;
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
    Controller.subclasses = [];
    Controller.byId = function(id){
      var action, cont;
      if (!(id instanceof Array)) {
        id = __split.call(id, '.');
      }
      action = id.pop();
      if (!(id.join('.') in this.subclasses)) {
        return;
      }
      cont = this.subclasses[id.join('.')];
      if (action in cont.prototype && !(action in this.prototype)) {
        return (__bind(new cont(), action));
      }
    };
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
    Controller.extended = function(sub){
      sub.id = sub.id != null
        ? typeof sub.id === 'string'
          ? __split.call(sub.id, '.')
          : sub.id instanceof Array
            ? sub.id
            : (function(){
              throw new TypeError("How is '" + sub.id + "' an id?");
            }())
        : [sub.displayName];
      if (sub.id.join('.') in this.subclasses) {
        this.prepare(sub.id.join('.'));
      }
      return this.subclasses[sub.id.join('.')] = sub;
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
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
