(function(){
  var Config, url, methods, InvalidMethod, NotFound, Generic, UrlMapper, Router;
  Config = require("../main").Config;
  url = require('url');
  methods = ['*', 'HEAD', 'GET', 'POST', 'PUT', 'TRACE', 'DELETE', 'OPTIONS', 'PATCH'];
  (exports.Errors || (exports.Errors = {})).InvalidMethod = InvalidMethod = (function(superclass){
    InvalidMethod.displayName = 'InvalidMethod';
    var prototype = __extend(InvalidMethod, superclass).prototype, constructor = InvalidMethod;
    function InvalidMethod(it){
      superclass.call(this, "Invalid HTTP method " + it);
    }
    return InvalidMethod;
  }(Error));
  (exports.Errors || (exports.Errors = {})).NotFound = NotFound = (function(superclass){
    NotFound.displayName = 'NotFound';
    var prototype = __extend(NotFound, superclass).prototype, constructor = NotFound;
    function NotFound(it){
      superclass.call(this, "Could not route " + it);
    }
    return NotFound;
  }(Error));
  (exports.Errors || (exports.Errors = {})).Generic = Generic = (function(superclass){
    Generic.displayName = 'Generic';
    var prototype = __extend(Generic, superclass).prototype, constructor = Generic;
    function Generic(){
      superclass.call(this, "Something went wrong somewhere for some reason. Maybe.");
    }
    return Generic;
  }(Error));
  exports.UrlMapper = UrlMapper = (function(){
    UrlMapper.displayName = 'UrlMapper';
    var prototype = UrlMapper.prototype, constructor = UrlMapper;
    function UrlMapper(){}
    return UrlMapper;
  }());
  exports.Router = Router = (function(){
    Router.displayName = 'Router';
    var m, _i, _ref, _len, prototype = Router.prototype, constructor = Router;
    Router.route = function(){};
    prototype.routes = [];
    function Router(){}
    prototype.add = function(method, path, action){};
    for (_i = 0, _len = (_ref = methods).length; _i < _len; ++_i) {
      m = _ref[_i];
      prototype[m] = prototype.add.curry(m.toUpperCase());
    }
    prototype.use = function(obj){
      var id, func, _own = {}.hasOwnProperty, _results = [];
      for (id in obj) if (_own.call(obj, id)) {
        func = obj[id];
        _results.push(this.add(func.method || 'GET', path, func));
      }
      return _results;
    };
    return Router;
  }());
  exports[m] = function(it){
    var m, _i, _ref, _len, _results = [];
    for (_i = 0, _len = (_ref = methods).length; _i < _len; ++_i) {
      m = _ref[_i];
      _results.push((it.method = m.toUpperCase(), it));
    }
    return _results;
  };
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
}).call(this);
