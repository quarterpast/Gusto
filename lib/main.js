(function(){
  var path, cluster, os, fs, util, Sync, __slice = [].slice;
  path = require('path');
  cluster = require('cluster');
  os = require('os');
  fs = require('fs');
  util = require('util');
  Sync = require('sync');
  exports.async = function(it){
    return it.async();
  };
  exports.future = function(it){
    return it.future();
  };
  exports.Config = new function(){
    this.appDir = process.cwd();
    this.routes = path.join(this.appDir, "conf", "routes.conf");
    this.controllerPath = path.join(this.appDir, "app", "controllers");
    this.templatePath = path.join(this.appDir, "app", "views");
    this.logLevel = 1;
    this.port = 8001;
    this.host = null;
    this.fork = true;
  };
  exports.loadConfig = function(conf){
    if (typeof conf === 'string') {
      return fs.readFile(conf, function(err, json){
        if (err) {
          throw err;
        }
        return __import(exports.Config, JSON.parse(json));
      });
    } else {
      return __import(exports.Config, conf);
    }
  };
  if (cluster.isMaster && exports.Config.fork) {
    exports.run = function(){
      var p, __i, __ref, __len, __results = [];
      for (__i = 0, __len = (__ref = os.cpus()).length; __i < __len; ++__i) {
        p = __ref[__i];
        __results.push(cluster.fork());
      }
      return __results;
    };
  } else {
    exports.run = function(){
      var Logger, vm, Server;
      Logger = (function(){
        Logger.displayName = 'Logger';
        var prototype = Logger.prototype, constructor = Logger;
        Logger.colours = {
          red: "\x1b[31m",
          reset: "\x1b[0m"
        };
        Logger.levels = [];
        Logger.setLevel = function(level){
          var i, lvl, log, __ref, __len, __i, __len1, __results = [];
          for (i = 0, __len = (__ref = this.levels).length; i < __len; ++i) {
            lvl = __ref[i];
            for (__i = 0, __len1 = lvl.length; __i < __len1; ++__i) {
              log = lvl[__i];
              __results.push(log.silent = i < level);
            }
          }
          return __results;
        };
        prototype.silent = false;
        function Logger(level, id, stream){
          var __this = this instanceof __ctor ? this : new __ctor;
          __this.level = level;
          __this.id = id;
          __this.stream = stream != null
            ? stream
            : process.stdout;
          if (constructor.levels[level] != null) {
            constructor.levels[level].push(__this);
          } else {
            constructor.levels[level] = [__this];
          }
          return __this;
        } function __ctor(){} __ctor.prototype = prototype;
        prototype.print = function(){
          if (!this.silent) {
            return this.stream.write(this.id + "\t" + process.pid + "\t" + util.format.apply(this, arguments) + "\n");
          }
        };
        return Logger;
      }());
      vm = require('vm');
      exports.Log = {
        debug: __bind(Logger(0, 'DEBUG'), 'print'),
        log: __bind(Logger(1, 'LOG'), 'print'),
        warn: __bind(Logger(2, 'WARN', process.stderr), 'print'),
        error: __bind(Logger(3, Logger.colours.red + "ERROR" + Logger.colours.reset, process.stderr), 'print')
      };
      exports.Config.engines = {
        eco: {
          compile: exports.async(function(file){
            return vm.createScript(Coco.compile('"""' + fs.readFile.sync(null, file) + '"""', {
              bare: true
            }));
          })
        },
        js: {
          compile: exports.async(function(file){
            return vm.createScript(fs.readFile.sync(null, file));
          })
        }
      };
      Logger.setLevel(exports.Config.logLevel);
      Server = require("./server/server").Server;
      return exports.Server = new Server(exports.Config.port, exports.Config.host);
    };
  }
  Function.prototype.curry = function(curried){
    var func;
    func = this;
    return function(){
      return func.apply(this, [curried].concat(__slice.call(arguments)));
    };
  };
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
