(function(){
  var Walk, Reloader, async, handle, Server, Log, dirs, fs, ViewReloader, View, ViewSystem, __ref, __this = this;
  __ref = require("./loader"), Walk = __ref.Walk, Reloader = __ref.Reloader;
  __ref = require("../magic"), async = __ref.async, handle = __ref.handle;
  Server = require("../server/server").Server;
  Log = require("../log").Log;
  dirs = require('path');
  fs = require('fs');
  ViewReloader = (function(superclass){
    ViewReloader.displayName = 'ViewReloader';
    var prototype = __extend(ViewReloader, superclass).prototype, constructor = ViewReloader;
    function ViewReloader(){
      var __this = this instanceof __ctor ? this : new __ctor;
      superclass.apply(__this, arguments);
      return __this;
    } function __ctor(){} __ctor.prototype = prototype;
    prototype.load = async(handle(function(name){
      name == null && (name = this.file);
      return fs.readFile.sync(fs, name);
    }));
    return ViewReloader;
  }(Reloader));
  exports.View = View = (function(){
    View.displayName = 'View';
    var prototype = View.prototype, constructor = View;
    prototype.helpers = {
      include: function(){},
      'extends': function(){}
    };
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
      return this.compiled.runInNewContext(args);
    };
    return View;
  }());
  ViewSystem = (function(){
    ViewSystem.displayName = 'ViewSystem';
    var prototype = ViewSystem.prototype, constructor = ViewSystem;
    function ViewSystem(views){
      var p, view;
      this.views = views;
      for (p in views) {
        view = views[p];
        view.system = this;
      }
    }
    prototype.resolve = function(path){
      var vpath, view, base, __ref;
      for (vpath in __ref = this.views) {
        view = __ref[vpath];
        base = (__fn.call(dirs, vpath, view));
        if (base === path) {
          return view;
        }
      }
      throw Error('unimplemented');
      function __fn(vpath, view){
        return this.join(this.dirname(vpath), this.basename(vpath, this.extname(vpath)));
      }
    };
    return ViewSystem;
  }());
  exports.ViewLoader = function(dir){
    var out;
    out = {};
    Walk(dir).forEach(function(file){
      return ViewReloader(file, handle(function(view){
        var ext, that, rend;
        ext = dirs.extname(file).substr(1);
        if ((that = View.renderers[ext]) != null) {
          rend = new that(view);
        } else {
          return;
        }
        return out[dirs.relative(dir, file)] = new View(rend);
      }));
    });
    return ViewSystem(out);
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
