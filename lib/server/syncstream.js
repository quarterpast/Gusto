(function(){
  var async, SyncStream, FutureStream;
  async = require("../main").async;
  exports.SyncStream = SyncStream = (function(){
    SyncStream.displayName = 'SyncStream';
    var prototype = SyncStream.prototype, constructor = SyncStream;
    prototype.$buffer = null;
    function _ctor(){} _ctor.prototype = prototype;
    function SyncStream(read, length){
      var off, _this = new _ctor;
      _this.read = read;
      off = 0;
      _this.$buffer = new Buffer(length) || 1024;
      _this.read.on('error', function(e){
        throw e;
      });
      _this.read.on('data', function(chunk){
        var bigger;
        if (chunk.length > _this.$buffer.length - off) {
          bigger = new Buffer(_this.$buffer.length + 1024);
          _this.$buffer.copy(bigger);
          _this.$buffer = bigger;
        }
        chunk.copy(_this.$buffer, off);
        return off += chunk.length;
      });
      return _this;
    }
    prototype.out = async(function(){
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
