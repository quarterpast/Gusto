(function(){
  var Config, url, methods, NotFound, UrlMapper, Router;
  Config = require("../main").Config;
  url = require('url');
  methods = ['*', 'HEAD', 'GET', 'POST', 'PUT', 'TRACE', 'DELETE', 'OPTIONS', 'PATCH'];
  exports.NotFound = NotFound = (function(superclass){
    NotFound.displayName = 'NotFound';
    var prototype = __extend(NotFound, superclass).prototype, constructor = NotFound;
    function NotFound(it){
      superclass.call(this, "Could not route " + it);
    }
    return NotFound;
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
    Router.routers = [];
    Router.route = function(req){
      var router, route, _i, _ref, _len, _j, _ref2, _len2, _results = [];
      for (_i = 0, _len = (_ref = this.routers).length; _i < _len; ++_i) {
        router = _ref[_i];
        for (_j = 0, _len2 = (_ref2 = router.routes).length; _j < _len2; ++_j) {
          route = _ref2[_j];
          if (route.match(req.url)) {
            _results.push(route.action);
          } else {
            _results.push(new NotFound(req.url));
          }
        }
      }
      return _results;
    };
    prototype.routes = [];
    function Router(){
      constructor.routers.push(this);
    }
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
