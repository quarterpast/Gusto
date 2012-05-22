(function(){
  var fs, path, Sync, signal, Log, async, Reloader, __ref;
  fs = require('fs');
  path = require('path');
  Sync = require('sync');
  signal = require("./signal").signal;
  __ref = require("../main"), Log = __ref.Log, async = __ref.async;
  Reloader = (function(superclass){
    Reloader.displayName = 'Reloader';
    var prototype = __extend(Reloader, superclass).prototype, constructor = Reloader;
    function watch(file, cb){
      try {
        return fs.watch(file, cb);
      } catch (e) {
        Log.debug("Can't use fs.watch for some reason.\n\tFalling back on fs.watchFile for " + path.basename(file));
        return fs.watchFile(file, function(curr, prev){
          if (curr.mtime !== prev.mtime) {
            return cb("change", file);
          }
        });
      }
    }
    function Reloader(file){
      var __this = this instanceof __ctor ? this : new __ctor;
      __this.file = file;
      watch(file, function(ev, name){
        name == null && (name = file);
        name = (function(){
          return this.join(this.dirname(file), this.basename(name));
        }.call(path));
        return __this.load(name, function(it){
          return __this.fire('reload', it);
        });
      });
      return __this;
    } function __ctor(){} __ctor.prototype = prototype;
    prototype.load = async(function(name){
      name == null && (name = this.file);
      delete require.cache[path.resolve(__dirname, name)];
      return require(name);
    });
    return Reloader;
  }(process.EventEmitter));
  exports.Loader = async(function(dir, merge){
    var out, walk;
    merge == null && (merge = function(obj, add, fname){
      var route, action, key, __ref, __results = [];
      for (route in __ref = add.routes) {
        action = __ref[route];
        key = action.id || path.join(cont, route);
        __results.push(obj[key] = action);
      }
      return __results;
    });
    out = {};
    walk = async(function(file){
      var stat, files, f, rl, __i, __len, __results = [];
      stat = fs.stat.sync(file);
      if (stat.isDirectory()) {
        files = fs.readdir.sync(file);
        for (__i = 0, __len = files.length; __i < __len; ++__i) {
          f = files[__i];
          __results.push(walk(path.join(file, f)));
        }
        return __results;
      } else {
        rl = Reloader(file);
        rl.on('reload', function(e, mod){
          return merge(obj, mod, file);
        });
        return rl.load();
      }
    });
    walk(dir);
    return out;
  });
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
}).call(this);
