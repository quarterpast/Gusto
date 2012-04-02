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
    function _ctor(){} _ctor.prototype = prototype;
    function Reloader(file){
      var _this = new _ctor;
      _this.file = file;
      _this.watch(file, function(ev, name){
        name == null && (name = file);
        name = (function(){
          return this.join(this.dirname(file), this.basename(name));
        }.call(path));
        return _this.load(name, __bind(_this.reload, 'fire'));
      });
      return _this;
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
  exports.Loader = Loader = (function(){
    Loader.displayName = 'Loader';
    var prototype = Loader.prototype, constructor = Loader;
    function add(dest, src){
      var k, v;
      for (k in src) {
        v = src[k];
        if ([typeof dest[k], typeof v].every(_fn)) {
          add(dest[k], v);
        } else {
          dest[k] = v;
        }
      }
      return dest;
      function _fn(it){
        return it === "object";
      }
    }
    function _ctor(){} _ctor.prototype = prototype;
    function Loader(dir, cb){
      var files, file, res, stat, rl, _i, _len, _this = new _ctor;
      files = fs.readdir.sync(null, dir);
      for (_i = 0, _len = files.length; _i < _len; ++_i) {
        file = files[_i];
        res = path.join(dir, file);
        stat = fs.stat.sync(null, res);
        add(_this, stat.isDirectory()
          ? Loader(res, cb)
          : (rl = Reloader(res), rl.reload.connect(_fn), rl.load()));
        if (cb != null) {
          cb.call(_this);
        }
      }
      return _this;
      function _fn(e, mod){
        if (cb != null) {
          cb.call(_this);
        }
        return add(_this, mod);
      }
    }
    return Loader;
  }());
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
