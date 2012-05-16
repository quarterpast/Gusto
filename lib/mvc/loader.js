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
    function merge(dest, src, cb, acc){
      var k, v, d;
      acc == null && (acc = "");
      for (k in src) {
        v = src[k];
        d = acc.length ? acc + "." + k : k;
        if ([typeof dest[k], typeof v].every(_fn)) {
          merge(dest[k], v, cb, d);
        } else {
          dest[k] = cb != null ? cb(v, d) : v;
        }
      }
      return dest;
      function _fn(it){
        return it === "object";
      }
    }
    prototype.load = signal();
    prototype.out = {};
    function Loader(cb){
      this.cb = cb;
    }
    prototype.run = async(function(dir){
      var files, file, res, stat, l, rl, _i, _len, _this = this;
      files = fs.readdir.sync(null, dir);
      for (_i = 0, _len = files.length; _i < _len; ++_i) {
        file = files[_i];
        res = path.join(dir, file);
        stat = fs.stat.sync(null, res);
        merge(this.out, stat.isDirectory()
          ? (l = new Loader(this.cb), l.load.connect(_fn), l.run(res))
          : (rl = Reloader(res), rl.reload.connect(_fn2), this.load.fire(this.out), rl.load()), this.cb);
      }
      return this.out;
      function _fn(){
        return _this.load.apply(_this, arguments);
      }
      function _fn2(e, mod){
        _this.load.fire(_this.out);
        return merge(_this, mod);
      }
    });
    return Loader;
  }());
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
