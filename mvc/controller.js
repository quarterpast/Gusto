(function(){
  var Controller, global, namespace, __slice = [].slice;
  exports.Controller = Controller = (function(){
    Controller.displayName = 'Controller';
    var prototype = Controller.prototype, constructor = Controller;
    Controller.subclasses = [];
    Controller.extended = function(it){
      it.id = [it.displayName];
      return this.subclasses.push(it);
    };
    prototype.render = function(){};
    function Controller(){}
    return Controller;
  }());
  global = this;
  namespace = (function(){
    namespace.displayName = 'namespace';
    var prototype = namespace.prototype, constructor = namespace;
    prototype.glom = function(it){
      var i, _i, _ref, _len, _results = [];
      for (_i = 0, _len = (_ref = this.id.inner || this.id).length; _i < _len; ++_i) {
        i = _ref[_i];
        _results.push(it.id.unshift(i));
      }
      return _results;
    };
    prototype.add = function(){
      var things, thing, klass, _i, _len, _, _results = [];
      things = __slice.call(arguments);
      for (_i = 0, _len = things.length; _i < _len; ++_i) {
        thing = things[_i];
        if (thing instanceof namespace) {
          this[thing.id[0]] = thing;
          _results.push(this.glom(thing));
        } else {
          __import(this, thing);
          for (_ in thing) {
            klass = thing[_];
            _results.push(this.glom(klass));
          }
        }
      }
      return _results;
    };
    function _ctor(){} _ctor.prototype = prototype;
    function namespace(id){
      var things, kids, _this = new _ctor;
      things = __slice.call(arguments, 1);
      _this.id = new (function(){
        var prototype = constructor.prototype;
        function constructor(){
          this.inner = [id];
        }
        prototype.unshift = function(it){
          var thing, klass, _i, _ref, _len, _;
          for (_i = 0, _len = (_ref = things).length; _i < _len; ++_i) {
            thing = _ref[_i];
            if (thing instanceof namespace) {
              thing.id.unshift(it);
            } else {
              for (_ in thing) {
                klass = thing[_];
                klass.id.unshift(it);
              }
            }
          }
          return this.inner.unshift(it);
        };
        prototype.toString = function(){
          return this.inner.toString();
        };
        prototype[0] = id;
        return constructor;
      }());
      kids = {};
      _this.add.apply(_this, things);
      global[id] = _this;
      return _this;
    }
    return namespace;
  }());
  namespace('ns', {
    Thing: (function(superclass){
      Thing.displayName = 'Thing';
      var prototype = __extend(Thing, superclass).prototype, constructor = Thing;
      prototype.index = function(){};
      function Thing(){}
      return Thing;
    }(exports.Controller))
  }, namespace('sub', {
    News: (function(superclass){
      News.displayName = 'News';
      var prototype = __extend(News, superclass).prototype, constructor = News;
      prototype.index = function(){
        return this.render({
          hello: 'there'
        });
      };
      function News(){}
      return News;
    }(exports.Controller)),
    Other: (function(superclass){
      Other.displayName = 'Other';
      var prototype = __extend(Other, superclass).prototype, constructor = Other;
      prototype.index = function(){
        return this.render({
          hello: 'there'
        });
      };
      function Other(){}
      return Other;
    }(exports.Controller))
  }, namespace('nest', {
    Bird: (function(superclass){
      Bird.displayName = 'Bird';
      var prototype = __extend(Bird, superclass).prototype, constructor = Bird;
      prototype.index = function(){};
      function Bird(){}
      return Bird;
    }(exports.Controller))
  })));
  this.ns.add({
    Whatever: (function(){
      Whatever.displayName = 'Whatever';
      var prototype = Whatever.prototype, constructor = Whatever;
      function Whatever(){}
      return Whatever;
    }())
  });
  console.log(this.ns.sub.nest.Bird.id);
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
}).call(this);
