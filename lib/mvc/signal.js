(function(){
  var signal;
  exports.signal = signal = (function(){
    signal.displayName = 'signal';
    var prototype = signal.prototype, constructor = signal;
    prototype.$callbacks = [];
    function _ctor(){} _ctor.prototype = prototype;
    function signal(def){
      var _this = new _ctor;
      if (def != null) {
        _this.$callbacks[0] = def;
      }
      return _this;
    }
    prototype.connect = function(cb){
      return this.$callbacks.push(cb);
    };
    prototype.fire = function(){
      var cb, _i, _ref, _len, _results = [];
      for (_i = 0, _len = (_ref = this.$callbacks).length; _i < _len; ++_i) {
        cb = _ref[_i];
        _results.push(cb.apply(this, arguments));
      }
      return _results;
    };
    return signal;
  }());
}).call(this);
