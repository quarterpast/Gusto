(function(){
  var fs, path, Q, Sync, async, handle, Server, Log, Reloader, walk, __ref;
  fs = require('fs');
  path = require('path');
  Q = require('q');
  Sync = require('sync');
  __ref = require("../magic"), async = __ref.async, handle = __ref.handle;
  Server = require("../server/server").Server;
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
  exports.Reloader = Reloader = (function(){
    Reloader.displayName = 'Reloader';
    var prototype = Reloader.prototype, constructor = Reloader;
    function watch(file, cb){
      cb("init", file);
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
    function Reloader(file, cb){
      var __this = this instanceof __ctor ? this : new __ctor;
      __this.file = file;
      watch(file, async(function(ev, name){
        name == null && (name = file);
        name = (function(){
          return this.join(this.dirname(file), this.basename(name));
        }.call(path));
        return cb(__this.load.sync(__this, name));
      }));
      return __this;
    } function __ctor(){} __ctor.prototype = prototype;
    prototype.load = async(handle(function(name){
      name == null && (name = this.file);
      delete require.cache[path.resolve(__dirname, name)];
      return require(name);
    }));
    return Reloader;
  }());
  exports.Walk = walk = function(file, acc){
    var stat, files, f, __i, __len;
    acc == null && (acc = []);
    stat = fs.stat.sync(fs, file);
    if (stat.isDirectory()) {
      files = fs.readdir.sync(fs, file);
      for (__i = 0, __len = files.length; __i < __len; ++__i) {
        f = files[__i];
        acc.concat(walk(path.join(file, f), acc));
      }
    } else {
      acc.push(file);
    }
    return acc;
  };
}).call(this);
