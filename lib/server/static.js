(function(){
  var Q, fs, Walk;
  Q = require('q');
  fs = require('fs');
  Walk = require("../mvc/loader").Walk;
  exports.file = function(file){
    var promise, __ref;
    promise = Q.ncall(fs.readFile, fs, file);
    return __ref = {}, __ref[file] = function(){
      return promise;
    }, __ref;
  };
  exports.dir = function(dir){
    var out, file, __i, __ref, __len;
    out = {};
    for (__i = 0, __len = (__ref = Walk(dir)).length; __i < __len; ++__i) {
      file = __ref[__i];
      __import(out, exports.file(file));
    }
    return out;
  };
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
