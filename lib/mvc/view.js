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
    prototype.helpers = function(){
      var __this = this;
      return {
        include: function(path, extra){
          var sub;
          extra == null && (extra = {});
          sub = __this.system.resolve(path);
          return sub.run(__import(__this.args, extra));
        },
        extend: function(path){
          __this.parent = __this.system.resolve(path);
          return "";
        }
      };
    };
    View.renderers = {};
    View.use = function(extra){
      return __import(this.renderers, extra);
    };
    View.add = function(ext, rend){
      return this.renderers[ext] = rend;
    };
    function View(compiled, system){
      this.compiled = compiled;
      this.system = system;
    }
    prototype.parent = false;
    prototype.run = function(args){
      var output;
      this.args = args;
      output = this.compiled.runInNewContext(__import(args, this.helpers()));
      if (this.parent) {
        output = this.parent.run({
          layout: output
        });
      }
      return output;
    };
    return View;
  }());
  ViewSystem = (function(){
    ViewSystem.displayName = 'ViewSystem';
    var prototype = ViewSystem.prototype, constructor = ViewSystem;
    prototype.views = {};
    function ViewSystem(views){
      if (views != null) {
        this.use(views);
      }
    }
    prototype.add = function(p, view){
      return this.views[p] = new View(view, this);
    };
    prototype.use = function(views){
      var p, view, __results = [];
      for (p in views) {
        view = views[p];
        __results.push(this.add(p, view));
      }
      return __results;
    };
    prototype.resolve = function(path){
      var vpath, view, base, __ref;
      for (vpath in __ref = this.views) {
        view = __ref[vpath];
        base = (__fn.call(dirs, vpath, view));
        if (base === path) {
          return view;
        }
      }
      return false;
      function __fn(vpath, view){
        return this.join(this.dirname(vpath), this.basename(vpath, this.extname(vpath)));
      }
    };
    return ViewSystem;
  }());
  exports.ViewLoader = function(dir){
    var out;
    out = new ViewSystem;
    Walk(dir).forEach(function(file){
      return ViewReloader(file, handle(function(view){
        var ext, that, rend;
        ext = dirs.extname(file).substr(1);
        if ((that = View.renderers[ext]) != null) {
          rend = new that(view);
        } else {
          return;
        }
        return out.add(dirs.relative(dir, file), rend);
      }));
    });
    return out;
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
