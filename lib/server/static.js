(function(){
  var Q, fs, path, mime, Walk, munge;
  Q = require('q');
  fs = require('fs');
  path = require('path');
  mime = require('mime-magic').fileWrapper;
  Walk = require("../mvc/loader").Walk;
  munge = __curry(function(a, b){
    return __import(a, b);
  });
  exports.file = __curry(function(base, dir, file){
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
  });
  exports.dir = function(base, dir){
    return fold(munge, {})(
    map(exports.file(base, dir))(
    Walk(dir)));
  };
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function __curry(f, args){
    return f.length ? function(){
      var params = args ? args.concat() : [];
      return params.push.apply(params, arguments) < f.length ?
        __curry.call(this, f, params) : f.apply(this, params);
    } : f;
  }
}).call(this);
