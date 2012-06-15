(function(){
  var Q, crypto, Log, Server, PromiseFuture, SyncStream, FutureStream, __slice = [].slice;
  Q = require('q');
  crypto = require('crypto');
  Log = require("./log").Log;
  Server = require("./server/server").Server;
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
  exports.PromiseFuture = exports.async(PromiseFuture = __curry(function(fu){
    var out;
    out = Q.defer();
    process.nextTick(function(){
      return out.resolve(fu.result);
    });
    return out.promise;
  }));
  exports.SyncStream = SyncStream = (function(){
    SyncStream.displayName = 'SyncStream';
    var prototype = SyncStream.prototype, constructor = SyncStream;
    prototype.$buffer = null;
    function SyncStream(read, length){
      var offset, __this = this instanceof __ctor ? this : new __ctor;
      __this.read = read;
      offset = 0;
      __this.$buffer = new Buffer(length) || 1024;
      __this.read.on('error', function(e){
        throw e;
      });
      __this.read.on('data', function(chunk){
        var bigger;
        if (chunk.length > __this.$buffer.lengthOffset) {
          bigger = new Buffer(__this.$buffer.length + 1024);
          __this.$buffer.copy(bigger);
          __this.$buffer = bigger;
        }
        chunk.copy(__this.$buffer, offset);
        return offset += chunk.length;
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
  exports.handle = function(func){
    var trapped;
    trapped = {};
    return function(){
      var args, hash, a, id, r, __i, __len;
      args = __slice.call(arguments);
      hash = crypto.createHash('sha1');
      for (__i = 0, __len = args.length; __i < __len; ++__i) {
        a = args[__i];
        hash.update((a != null ? a.toString() : void 8) || 'undefined');
      }
      id = hash.digest('hex');
      try {
        r = func.apply(this, arguments);
        if (trapped[id] != null) {
          trapped[id].resolve();
          delete trapped[id];
        }
        return r;
      } catch (e) {
        trapped[id] = Q.defer();
        Log.error(e.message);
        console.log(e.stack);
        Server.hijack(id, trapped[id].promise, {
          body: [e.message],
          status: 500
        });
      }
    };
  };
  function __curry(f, args){
    return f.length ? function(){
      var params = args ? args.concat() : [];
      return params.push.apply(params, arguments) < f.length ?
        __curry.call(this, f, params) : f.apply(this, params);
    } : f;
  }
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
}).call(this);
