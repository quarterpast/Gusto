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
    prototype.loaded = signal();
    function Reloader(file){
      var _this = this;
      this.file = file;
      this.load(file, true);
      this.watch(file, function(ev, name){
        name == null && (name = file);
        name = (function(){
          return this.join(this.dirname(file), this.basename(name));
        }.call(path));
        return _this.load(name);
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
    prototype.load = function(name, initial){
      initial == null && (initial = false);
      delete require.cache[path.join(__dirname, name)];
      return this.loaded.fire(initial, require(name));
    };
    return Reloader;
  }());
  exports.Loader = Loader = (function(){
    Loader.displayName = 'Loader';
    var prototype = Loader.prototype, constructor = Loader;
    function Loader(dir, cb){
      this.dir = dir;
      if (cb != null) {
        this.done.connect(cb);
      }
    }
    prototype.next = async(function(file){
      var stat, rl;
      stat = fs.stat.sync(null, path.join(this.dir, file));
      if (stat.isDirectory()) {
        return this.traverse(path.join(this.dir, file));
      } else {
        rl = new Reloader(path.join(this.dir, file));
        rl.loaded.connect(function(initial, mod){
          if (initial) {
            return def.resolve(mod);
          }
        });
        return def.promise;
      }
    });
    prototype.traverse = async(function(){
      var _this = this;
      return Q.ncall(fs.readdir, fs, this.dir).then(function(files){
        var file;
        _this.done.fire(files);
        return Q.all((function(){
          var _i, _ref, _len, _results = [];
          for (_i = 0, _len = (_ref = files).length; _i < _len; ++_i) {
            file = _ref[_i];
            _results.push(this.next(file));
          }
          return _results;
        }.call(_this)));
      });
    });
    return Loader;
  }());
}).call(this);
