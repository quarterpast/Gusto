(function(){
  var fs, path, Sync, signal, Log, async, Reloader, _ref;
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
        return _this.load(name, __bind(_this.reload, 'fire'));
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
    prototype.load = async(function(name){
      name == null && (name = this.file);
      delete require.cache[path.resolve(__dirname, name)];
      return require(name);
    });
    return Reloader;
  }());
  exports.Loader = async((function(){
    function Loader(dir){
      var files, file, stat, rl, mod, _i, _len, _results = [];
      files = fs.readdir.sync(null, dir);
      for (_i = 0, _len = files.length; _i < _len; ++_i) {
        file = files[_i];
        stat = fs.stat.sync(null, path.join(dir, file));
        if (stat.isDirectory()) {
          _results.push(Loader(path.join(dir, file)));
        } else {
          rl = new Reloader(path.join(dir, file));
          _results.push(mod = rl.load());
        }
      }
      return _results;
    }
    return Loader;
  }()));
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
