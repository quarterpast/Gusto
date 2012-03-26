(function(){
  var fs, path, Q, signal, Log, Reloader, Loader;
  fs = require('fs');
  path = require('path');
  Q = require('q');
  signal = require("./signal").signal;
  Log = require("../main").Log;
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
    prototype.done = signal();
    function Loader(dir){
      this.dir = dir;
    }
    prototype.next = function(file){
      var _this = this;
      return Q.ncall(fs.stat, fs, path.join(this.dir, file)).then(function(stat){
        var def, rl;
        if (stat.isDirectory()) {
          return _this.traverse(path.join(_this.dir, file));
        } else {
          def = Q.defer();
          rl = new Reloader(path.join(_this.dir, file));
          rl.loaded.connect(function(initial, mod){
            if (initial) {
              return def.resolve(mod);
            }
          });
          return def.promise;
        }
      }).end();
    };
    prototype.traverse = function(){
      var _this = this;
      return Q.ncall(fs.readdir, fs, this.dir).then(function(files){
        var file;
        return Q.all((function(){
          var _i, _ref, _len, _results = [];
          for (_i = 0, _len = (_ref = files).length; _i < _len; ++_i) {
            file = _ref[_i];
            _results.push(this.next(file));
          }
          return _results;
        }.call(_this)));
      });
    };
    return Loader;
  }());
}).call(this);
