(function(){
  var SyncStream, FutureStream;
  exports.async = function(it){
    return it.async();
  };
  exports.future = function(it){
    return it.future();
  };
  exports.SyncPromise = exports.async((function(){
    function SyncPromise(pr){
      return pr.then.sync(pr);
    }
    return SyncPromise;
  }()));
  exports.SyncStream = SyncStream = (function(){
    SyncStream.displayName = 'SyncStream';
    var prototype = SyncStream.prototype, constructor = SyncStream;
    prototype.$buffer = null;
    function SyncStream(read, length){
      var off, __this = this instanceof __ctor ? this : new __ctor;
      __this.read = read;
      off = 0;
      __this.$buffer = new Buffer(length) || 1024;
      __this.read.on('error', function(e){
        throw e;
      });
      __this.read.on('data', function(chunk){
        var bigger;
        if (chunk.length > __this.$buffer.length - off) {
          bigger = new Buffer(__this.$buffer.length + 1024);
          __this.$buffer.copy(bigger);
          __this.$buffer = bigger;
        }
        chunk.copy(__this.$buffer, off);
        return off += chunk.length;
      });
      return __this;
    } function __ctor(){} __ctor.prototype = prototype;
    prototype.out = exports.async(function(){
      this.read.on.sync(this.read, "end");
      return this.$buffer;
    });
    return SyncStream;
  }());
  exports.FutureStream = FutureStream = (function(superclass){
    FutureStream.displayName = 'FutureStream';
    var prototype = __extend(FutureStream, superclass).prototype, constructor = FutureStream;
    function FutureStream(){
      superclass.apply(this, arguments);
    }
    prototype.out = function(){
      return superclass.prototype.out.future.call(this, this);
    };
    return FutureStream;
  }(SyncStream));
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
}).call(this);
