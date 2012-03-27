(function(){
  var util, pathutil, Log, Renderer, Controller, __split = ''.split;
  util = require('util');
  pathutil = require('path');
  Log = require("../main").Log;
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
      if (action in cont.prototype && !(action in prototype)) {
        return (__bind(new cont(), action));
      }
    };
    Controller.prepare = function(){
      var id, sub, action, fn, _ref, _ref2, _results = [];
      for (id in _ref = this.subclasses) {
        sub = _ref[id];
        for (action in _ref2 = new sub) {
          fn = _ref2[action];
          if (action in sub.prototype && !(action in prototype)) {
            _results.push((fn.action = action, fn.id = __split.call(id, '.'), fn));
          }
        }
      }
      return _results;
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
      var $, _ref, _ref2;
      $ = arguments.callee.caller;
      if (typeof action !== 'string') {
        _ref = [$.action, action], action = _ref[0], args = (_ref2 = _ref[1]) != null
          ? _ref2
          : {};
      }
      return [JSON.stringify(args)];
    };
    return Controller;
  }());
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
