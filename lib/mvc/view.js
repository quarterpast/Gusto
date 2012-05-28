(function(){
  var Loader, Reloader, asPaths, async, path, Q, fs, ViewReloader, View, __ref, __this = this;
  __ref = require("./loader"), Loader = __ref.Loader, Reloader = __ref.Reloader, asPaths = __ref.asPaths;
  async = require("../magic").async;
  path = require('path');
  Q = require('q');
  fs = require('fs');
  ViewReloader = (function(superclass){
    ViewReloader.displayName = 'ViewReloader';
    var prototype = __extend(ViewReloader, superclass).prototype, constructor = ViewReloader;
    function ViewReloader(){
      var __this = this instanceof __ctor ? this : new __ctor;
      superclass.apply(__this, arguments);
      return __this;
    } function __ctor(){} __ctor.prototype = prototype;
    prototype.load = async(function(name){
      name == null && (name = this.file);
      return fs.readFile.sync(name);
    });
    return ViewReloader;
  }(Reloader));
  exports.View = View = (function(){
    View.displayName = 'View';
    var prototype = View.prototype, constructor = View;
    View.renderers = {};
    View.use = function(extra){
      return __import(this.renderers, extra);
    };
    View.add = function(ext, rend){
      return this.renderers[ext] = rend;
    };
    function View(compiled){
      this.compiled = compiled;
    }
    prototype.run = function(args){
      return this.compiled(args);
    };
    return View;
  }());
  exports.ViewLoader = function(dir){
    var out, file, view, ext, that, rend, __ref, __results = [];
    out = {};
    for (file in __ref = Loader(dir, asPaths(ViewReloader))) {
      view = __ref[file];
      ext = path.extname(file);
      if ((that = View.renderers[ext]) != null) {
        rend = new that(view);
      } else {
        continue;
      }
      __results.push(out[file] = new View(rend));
    }
    return __results;
  };
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
