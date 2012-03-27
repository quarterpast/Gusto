(function(){
  var signal;
  exports.signal = signal = (function(){
    signal.displayName = 'signal';
    var prototype = signal.prototype, constructor = signal;
    prototype.$callbacks = [];
    prototype.$queue = [];
    function _ctor(){} _ctor.prototype = prototype;
    function signal(def){
      var _this = new _ctor;
      if (def != null) {
        _this.$callbacks[0] = def;
      }
      return _this;
    }
    prototype.connect = function(cb){
      if (this.$queue.length) {
        cb.apply(this, this.$queue.shift());
      }
      return this.$callbacks.push(cb);
    };
    prototype.fire = function(){
      var cb, _i, _ref, _len, _run, _results = [];
      for (_i = 0, _len = (_ref = this.$callbacks).length; _i < _len; ++_i) {
        cb = _ref[_i];
        _run = true;
        _results.push(cb.apply(this, arguments));
      } if (!_run) {
        return this.$queue.push(arguments);
      }
      return _results;
    };
    return signal;
  }());
}).call(this);
