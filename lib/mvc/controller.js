(function(){
  var util, pathutil, Loader, config, Q, Controller, __split = ''.split, __slice = [].slice;
  util = require('util');
  pathutil = require('path');
  Loader = require("./loader.co").Loader;
  config = require.main.exports.config;
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
      var action, cont, _ref;
      if (!(id instanceof Array)) {
        id = __split.call(id, '.');
      }
      action = id.pop();
      cont = this.subclasses[id.join('.')];
      if (action in cont.prototype && !(action in Controller.prototype)) {
        return __bind((_ref = new cont, _ref.action = action, _ref.id = id, _ref), action);
      }
    };
    Controller.extended = function(sub){
      sub.id = sub.id != null
        ? Object.isString(sub.id)
          ? __split.call(sub.id, '.')
          : Object.isArray(sub.id)
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
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
