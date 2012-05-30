(function(){
  var Config, signal, url, methods, NotFound, Route, Router, m, __i, __len;
  Config = require("../main").Config;
  signal = require("../mvc/signal").signal;
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
      this.method = method || '*';
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
      var router, route, params, __i, __ref, __len, __j, __ref1, __len1, __results = [];
      for (__i = 0, __len = (__ref = this.routers).length; __i < __len; ++__i) {
        router = __ref[__i];
        for (__j = 0, __len1 = (__ref1 = router.routes).length; __j < __len1; ++__j) {
          route = __ref1[__j];
          if (params = route.match(req.url)) {
            __results.push({
              action: route.action,
              params: params
            });
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
      prototype[m] = prototype.add.bind(null, m.toUpperCase());
    }
    prototype.use = function(obj){
      var path, func, __this = this, __own = {}.hasOwnProperty, __results = [];
      if (obj.reload != null) {
        obj.reload.connect(function(keys){
          var key, __i, __len, __results = [];
          for (__i = 0, __len = keys.length; __i < __len; ++__i) {
            key = keys[__i];
            __results.push(__this.add(obj[key].method, key, obj[key]));
          }
          return __results;
        });
      }
      for (path in obj) if (__own.call(obj, path)) {
        func = obj[path];
        __results.push(this.add(func.method, path, func));
      }
      return __results;
    };
    return Router;
  }());
  for (__i = 0, __len = methods.length; __i < __len; ++__i) {
    m = methods[__i];
    exports[m] = __fn;
  }
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
  function __fn(it){
    return it.method = m.toUpperCase(), it;
  }
}).call(this);
