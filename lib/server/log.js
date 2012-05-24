(function(){
  var util, Logger;
  util = require('util');
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
  exports.Log = {
    debug: __bind(Logger(0, 'DEBUG'), 'print'),
    log: __bind(Logger(1, 'LOG'), 'print'),
    warn: __bind(Logger(2, 'WARN', process.stderr), 'print'),
    error: __bind(Logger(3, Logger.colours.red + "ERROR" + Logger.colours.reset, process.stderr), 'print')
  };
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
