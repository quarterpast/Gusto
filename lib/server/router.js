(function(){
  var Config, url, methods, NotFound, Route, Router;
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
  exports.Route = Route = (function(){
    Route.displayName = 'Route';
    var prototype = Route.prototype, constructor = Route;
    function Route(method, path, action){
      this.method = method || 'GET';
      this.path = path;
      this.action = action;
      action.toString = action.route = __bind(this, 'reverse');
    }
    prototype.match = function(uri){
      throw Error('unimplemented');
    };
    prototype.reverse = function(params){
      throw Error('unimplemented');
    };
    return Route;
  }());
  exports.Router = Router = (function(){
    Router.displayName = 'Router';
    var m, __i, __ref, __len, prototype = Router.prototype, constructor = Router;
    Router.routers = [];
    Router.route = function(req){
      var router, route, __i, __ref, __len, __j, __ref1, __len1, __results = [];
      for (__i = 0, __len = (__ref = this.routers).length; __i < __len; ++__i) {
        router = __ref[__i];
        for (__j = 0, __len1 = (__ref1 = router.routes).length; __j < __len1; ++__j) {
          route = __ref1[__j];
          if (route.match(req.url)) {
            __results.push(route.action);
          } else {
            __results.push(new NotFound(req.url));
          }
        }
      }
      return __results;
    };
    prototype.routes = [];
    function Router(){
      constructor.routers.push(this);
    }
    prototype.add = function(method, path, action){
      return this.routes.push(method instanceof Route
        ? method
        : new Route(method, path, action));
    };
    for (__i = 0, __len = (__ref = methods).length; __i < __len; ++__i) {
      m = __ref[__i];
      prototype[m] = prototype.add.curry(m.toUpperCase());
    }
    prototype.use = function(obj){
      var id, func, __own = {}.hasOwnProperty, __results = [];
      for (id in obj) if (__own.call(obj, id)) {
        func = obj[id];
        __results.push(this.add(func.method, path, func));
      }
      return __results;
    };
    return Router;
  }());
  exports[m] = function(it){
    var m, __i, __ref, __len, __results = [];
    for (__i = 0, __len = (__ref = methods).length; __i < __len; ++__i) {
      m = __ref[__i];
      __results.push((it.method = m.toUpperCase(), it));
    }
    return __results;
  };
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
