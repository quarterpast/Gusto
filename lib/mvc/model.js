(function(){
  var util, pathutil, Loader, Config, Log, async, Renderer, Models, Model, __ref, __split = ''.split;
  util = require('util');
  pathutil = require('path');
  Loader = require("./loader").Loader;
  __ref = require("../main"), Config = __ref.Config, Log = __ref.Log, async = __ref.async;
  Renderer = require("./renderer").Renderer;
  exports.Models = Models = (function(superclass){
    Models.displayName = 'Models';
    var prototype = __extend(Models, superclass).prototype, constructor = Models;
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
    Models.register = function(klass){
      throw Error('unimplemented');
    };
    function walk(obj, cb){
      var k, v, __results = [];
      for (k in obj) {
        v = obj[k];
        if (typeof v === 'object') {
          __results.push(walk(v, cb));
        } else {
          __results.push(cb(v, k));
        }
      }
      return __results;
    }
    function Models(){
      superclass.call(this, Config.modelPath, function(mdls){
        return walk(mdls, Model.register);
      });
    }
    return Models;
  }(Loader));
  exports.Model = Model = (function(){
    Model.displayName = 'Model';
    var prototype = Model.prototype, constructor = Model;
    prototype.save = function(){};
    function Model(){}
    return Model;
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
