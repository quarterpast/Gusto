(function(){
  exports.signal = (function(){
    function signal(def){
      var $callbacks, $queue;
      $callbacks = [];
      $queue = [];
      if (def != null) {
        $callbacks[0] = def;
      }
      return {
        connect: function(cb){
          if ($queue.length) {
            cb.apply(this, $queue.shift());
          }
          return $callbacks.push(cb);
        },
        fire: function(){
          var cb, _i, _ref, _len, _run, _results = [];
          for (_i = 0, _len = (_ref = $callbacks).length; _i < _len; ++_i) {
            cb = _ref[_i];
            _run = true;
            _results.push(cb.apply(this, arguments));
          } if (!_run) {
            return $queue.push(arguments);
          }
          return _results;
        }
      };
    }
    return signal;
  }());
}).call(this);
