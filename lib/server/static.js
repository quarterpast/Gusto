(function(){
  var Q, fs, path, mime, Walk;
  Q = require('q');
  fs = require('fs');
  path = require('path');
  mime = require('mime-magic').fileWrapper;
  Walk = require("../mvc/loader").Walk;
  exports.file = function(base, file, dir){
    var promise, key, type, __ref;
    promise = Q.ncall(fs.readFile, fs, file);
    key = path.join(base, path.relative(dir, file));
    type = mime.future(null, file);
    return __ref = {}, __ref[key] = function(){
      return {
        body: promise.then(function(it){
          return [it];
        }),
        headers: {
          'content-type': type.result
        }
      };
    }, __ref;
  };
  exports.dir = function(base, dir){
    var out, file, __i, __ref, __len;
    out = {};
    for (__i = 0, __len = (__ref = Walk(dir)).length; __i < __len; ++__i) {
      file = __ref[__i];
      __import(out, exports.file(base, file, dir));
    }
    return out;
  };
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
