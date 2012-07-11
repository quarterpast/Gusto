(function(){
  var Log, Timer;
  Log = require("./log").Log;
  exports.Timer = Timer = (function(){
    Timer.displayName = 'Timer';
    var prototype = Timer.prototype, constructor = Timer;
    prototype.sections = {};
    function Timer(label){
      this.label = label;
      this.start('total');
    }
    prototype.end = __curry(function(){
      each(__bind(this, 'finish'))(
      keys(
      filter((function(it){
        return it instanceof Date;
      }))(
      this.sections)));
      Log.log(this.label + ": " + this.sections.total + "ms");
      return Log.debug(JSON.stringify(this.sections, null, 2));
    });
    prototype.start = __curry(function(section){
      return this.sections[section] = new Date;
    });
    prototype.finish = __curry(function(section){
      return this.sections[section] = new Date - this.sections[section];
    });
    return Timer;
  }());
  function __bind(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
  function __curry(f, args){
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      return params.push.apply(params, arguments) < f.length && arguments.length ?
        __curry.call(this, f, params) : f.apply(this, params);
    } : f;
  }
}).call(this);
