(function(){
  var Config, async, path, exists, Renderer, _ref;
  _ref = require("../main"), Config = _ref.Config, async = _ref.async;
  path = require('path');
  exists = function(p, cb){
    return path.exists(p, function(e){
      return cb(null, e);
    });
  };
  exports.Renderer = Renderer = (function(){
    Renderer.displayName = 'Renderer';
    var prototype = Renderer.prototype, constructor = Renderer;
    Renderer.subclasses = {};
    Renderer.extended = function(sub){
      return this.subclasses[sub.displayName.toLowerCase()] = sub;
    };
    Renderer.resolve = async(function(file){
      var ext, eng, f, filenames, _ref, _res, _i, _ref2, _len;
      if (ext = path.extname(file)) {
        return this.subclasses[ext] || (function(){
          throw Error("No template for " + file);
        }());
      }
      for (ext in _ref = this.subclasses) {
        eng = _ref[ext];
        _res = [];
        for (_i = 0, _len = (_ref2 = [file + "/index." + ext, file + "." + ext]).length; _i < _len; ++_i) {
          f = _ref2[_i];
          _res.push(path.join(Config.templatePath, f));
        }
        filenames = _res;
        if (exists.sync(null, filename)) {
          return eng.compile.sync(eng, filename);
        }
      }
      throw Error("No template for " + file);
    });
    Renderer.register = function(ext, thing){
      if (!(thing.compile instanceof Function)) {
        throw TypeError(thing + " has no compile method");
      }
      return (function(superclass){
        var prototype = __extend(constructor, superclass).prototype;
        constructor.displayName = ext;
        __import(prototype, thing);
        function constructor(){
          superclass.apply(this, arguments);
        }
        return constructor;
      }(Renderer));
    };
    prototype.config = function(file){
      this.file = file;
    };
    prototype.partial = function(part){
      var rel;
      return rel = path.resolve(this.file);
    };
    function Renderer(){}
    return Renderer;
  }());
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
