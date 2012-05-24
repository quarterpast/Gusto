(function(){
  var Loader, Reloader, async, path, Q, fs, ViewReloader, View, ViewLoader, __ref;
  __ref = require("./loader"), Loader = __ref.Loader, Reloader = __ref.Reloader;
  async = require("../main").async;
  path = require('path');
  Q = require('q');
  fs = require('fs');
  ViewReloader = (function(superclass){
    ViewReloader.displayName = 'ViewReloader';
    var prototype = __extend(ViewReloader, superclass).prototype, constructor = ViewReloader;
    ViewReloader.asPaths = superclass.asPaths;
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
    function View(path, compiled){
      this.path = path;
      this.compiled = compiled;
      constructor[path] = this;
    }
    prototype.run = function(args){
      return this.compiled(args);
    };
    return View;
  }());
  exports.ViewLoader = ViewLoader = (function(){
    ViewLoader.displayName = 'ViewLoader';
    var prototype = ViewLoader.prototype, constructor = ViewLoader;
    function ViewLoader(dir){
      var file, view, ext, that, rend, __ref, __this = this instanceof __ctor ? this : new __ctor;
      for (file in __ref = Loader(dir, ViewReloader.asPaths)) {
        view = __ref[file];
        ext = path.extname(file);
        if ((that = View.renderers[ext]) != null) {
          rend = new that(view);
        } else {
          continue;
        }
        new View(file, rend);
      }
      return __this;
    } function __ctor(){} __ctor.prototype = prototype;
    return ViewLoader;
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
