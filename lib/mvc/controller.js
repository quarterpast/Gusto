(function(){
  var util, pathutil, Loader, Log, Q, Controller, __split = ''.split, __slice = [].slice;
  util = require('util');
  pathutil = require('path');
  Loader = require("./loader").Loader;
  Log = require("../main").Log;
  Q = require('q');
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
      cont = this.subclasses[id.join('.')];
      if (action in cont.prototype && !(action in Controller.prototype)) {
        return new cont()[action].bind({
          action: action,
          id: id
        });
      }
    };
    Controller.prepare = function(){
      var sub, _i, _ref, _len, _results = [];
      for (_i = 0, _len = (_ref = this.subclasses).length; _i < _len; ++_i) {
        sub = _ref[_i];
        _results.push(Log.warn("rdfnhtiershdriesnatdhrieht"));
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
      var path, _ref, _ref2;
      if (typeof action !== 'string') {
        _ref = [this.action, action], action = _ref[0], args = (_ref2 = _ref[1]) != null
          ? _ref2
          : {};
      }
      path = __slice.call(this.id).concat([action]).join("/");
      return [path];
    };
    return Controller;
  }());
}).call(this);
