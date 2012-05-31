(function(){
  var Walk, Reloader, async, handle, Server, Log, path, Q, fs, ViewReloader, View, __ref, __this = this;
  __ref = require("./loader"), Walk = __ref.Walk, Reloader = __ref.Reloader;
  __ref = require("../magic"), async = __ref.async, handle = __ref.handle;
  Server = require("../server/server").Server;
  Log = require("../log").Log;
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
    prototype.load = async(handle(function(name){
      name == null && (name = this.file);
      return fs.readFile.sync(fs, name);
    }));
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
      return this.compiled.runInNewContext(args);
    };
    return View;
  }());
  exports.ViewLoader = function(dir){
    var out;
    out = {};
    Walk(dir).forEach(function(file){
      return ViewReloader(file, handle(function(view){
        var ext, that, rend;
        ext = path.extname(file).substr(1);
        if ((that = View.renderers[ext]) != null) {
          rend = new that(view);
        } else {
          return;
        }
        return out[path.relative(dir, file)] = new View(rend);
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
