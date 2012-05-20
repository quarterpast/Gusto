(function(){
  var fs, path, Sync, signal, Log, async, Reloader, __ref;
  fs = require('fs');
  path = require('path');
  Sync = require('sync');
  signal = require("./signal").signal;
  __ref = require("../main"), Log = __ref.Log, async = __ref.async;
  Reloader = (function(){
    Reloader.displayName = 'Reloader';
    var prototype = Reloader.prototype, constructor = Reloader;
    prototype.reload = signal();
    function Reloader(file){
      var __this = this instanceof __ctor ? this : new __ctor;
      __this.file = file;
      __this.watch(file, function(ev, name){
        name == null && (name = file);
        name = (function(){
          return this.join(this.dirname(file), this.basename(name));
        }.call(path));
        return __this.load(name, __bind(__this.reload, 'fire'));
      });
      return __this;
    } function __ctor(){} __ctor.prototype = prototype;
    prototype.watch = function(file, cb){
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
    };
    prototype.load = async(function(name){
      name == null && (name = this.file);
      delete require.cache[path.resolve(__dirname, name)];
      return require(name);
    });
    return Reloader;
  }());
  path.separator = path.join("x", "x")[1];
  exports.Loader = async(function(dir, merge){
    var out;
    merge == null && (merge = function(obj, add, id){
      return obj[path.join.apply(path, id)] = add;
    });
    out = {};
    function walk(file){
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
        rl.reload.connect(function(e, mod){
          this.load.fire(this.out);
          return merge(obj, mod, file.split(path.separator));
        });
        this.load.fire(this.out);
        return rl.load();
      }
    }
    return walk(dir);
  });
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
