(function(){
  var Loader, Reloader, Renderer, path, fs, ViewReloader, ViewLoader, __ref;
  __ref = require("./loader"), Loader = __ref.Loader, Reloader = __ref.Reloader;
  Renderer = require("./renderer").Renderer;
  path = require('path');
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
  exports.ViewLoader = ViewLoader = (function(){
    ViewLoader.displayName = 'ViewLoader';
    var prototype = ViewLoader.prototype, constructor = ViewLoader;
    function ViewLoader(dir){
      var file, view, ext, __ref, __this = this instanceof __ctor ? this : new __ctor;
      for (file in __ref = Loader(dir, Reloader.asPaths(ViewReloader))) {
        view = __ref[file];
        ext = path.extname(file);
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
}).call(this);
