(function(){
  var fs, path, Sync, async, Log, Reloader;
  fs = require('fs');
  path = require('path');
  Sync = require('sync');
  async = require("../magic").async;
  Log = require("../log").Log;
  exports.Paths = function(obj){
    var acc;
    acc = {};
    function inner(o, dir){
      var k, v, p, __own = {}.hasOwnProperty, __results = [];
      dir == null && (dir = '');
      for (k in o) if (__own.call(o, k)) {
        v = o[k];
        p = path.join(dir, k);
        if (v instanceof Function) {
          __results.push(acc[p] = v);
        } else {
          __results.push(inner(v, p, acc));
        }
      }
      return __results;
    }
    inner(obj);
    return acc;
  };
  exports.Reloader = Reloader = (function(superclass){
    Reloader.displayName = 'Reloader';
    var prototype = __extend(Reloader, superclass).prototype, constructor = Reloader;
    Reloader.asPaths = async(function(obj, file){
      var rl;
      rl = this(file);
      rl.on('reload', function(e, mod){
        var route, action, key, __ref, __results = [];
        for (route in __ref = Paths(mod)) {
          action = __ref[route];
          key = action.id || route;
          __results.push(obj[key] = action);
        }
        return __results;
      });
      return rl.load();
    }.bind(Reloader));
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
  exports.Loader = async(function(dir, load){
    var out, walk;
    load == null && (load = Reloader.asPaths);
    out = {};
    walk = async(function(file){
      var stat, files, f, __i, __len, __results = [];
      stat = fs.stat.sync(file);
      if (stat.isDirectory()) {
        files = fs.readdir.sync(file);
        for (__i = 0, __len = files.length; __i < __len; ++__i) {
          f = files[__i];
          __results.push(walk(path.join(file, f)));
        }
        return __results;
      } else {
        return load(out, file);
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
