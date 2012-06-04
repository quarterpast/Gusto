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
          var cb, __i, __ref, __len, __run, __results = [];
          for (__i = 0, __len = (__ref = $callbacks).length; __i < __len; ++__i) {
            cb = __ref[__i];
            __run = true;
            __results.push(cb.apply(this, arguments));
          } if (!__run) {
            return $queue.push(arguments);
          }
          return __results;
        }
      };
    }
    return signal;
  }());
}).call(this);
