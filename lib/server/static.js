(function(){
  var Q, fs, path, Walk;
  Q = require('q');
  fs = require('fs');
  path = require('path');
  Walk = require("../mvc/loader").Walk;
  exports.file = function(file, base){
    var promise, __ref;
    base == null && (base = '/');
    promise = Q.ncall(fs.readFile, fs, file);
    return __ref = {}, __ref[path.relative(base, file)] = function(){
      return promise;
    }, __ref;
  };
  exports.dir = function(dir){
    var out, file, __i, __ref, __len;
    out = {};
    for (__i = 0, __len = (__ref = Walk(dir)).length; __i < __len; ++__i) {
      file = __ref[__i];
      __import(out, exports.file(file, dir));
    }
    return out;
  };
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
