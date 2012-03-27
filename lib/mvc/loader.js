(function(){
  var fs, path, Sync, signal, Log, async, Reloader, Loader, _ref;
  fs = require('fs');
  path = require('path');
  Sync = require('sync');
  signal = require("./signal").signal;
  _ref = require("../main"), Log = _ref.Log, async = _ref.async;
  Reloader = (function(){
    Reloader.displayName = 'Reloader';
    var prototype = Reloader.prototype, constructor = Reloader;
    prototype.reload = signal();
    function Reloader(file){
      var _this = this;
      this.file = file;
      this.watch(file, function(ev, name){
        name == null && (name = file);
        name = (function(){
          return this.join(this.dirname(file), this.basename(name));
        }.call(path));
        return _this.load(name, _this.reload.fire);
      });
    }
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
    prototype.load = async(function(name, initial){
      initial == null && (initial = false);
      delete require.cache[path.join(__dirname, name)];
      return [initial, require(name)];
    });
    return Reloader;
  }());
  exports.Loader = async(Loader = (function(){
    Loader.displayName = 'Loader';
    var prototype = Loader.prototype, constructor = Loader;
    function _ctor(){} _ctor.prototype = prototype;
    function Loader(dir, cb){
      var files, file, stat, rl, _i, _len, _this = new _ctor;
      files = fs.readdir.sync(null, dir);
      for (_i = 0, _len = files.length; _i < _len; ++_i) {
        file = files[_i];
        stat = fs.stat.sync(null, path.join(dir, file));
        if (stat.isDirectory()) {
          _this.traverse(path.join(dir, file));
        } else {
          rl = new Reloader(path.join(dir, file));
          rl.loaded.connect(_fn);
          return def.promise;
        }
      }
      return _this;
      function _fn(initial, mod){
        if (initial) {
          return def.resolve(mod);
        }
      }
    }
    return Loader;
  }()));
}).call(this);
