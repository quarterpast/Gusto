(function(){
  var Config, signal, url, methods, NotFound, Route, Router;
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
      this.method = method;
      this.path = path;
      this.action = action;
      action.toString = action.route = __bind(this, 'reverse');
    }
    prototype.match = function(request){
      var reqparts, searchparts, params, i, part, reqpart, param, type, val, __ref, __len, __own = {}.hasOwnProperty;
      if ((__ref = this.method) != '*' && __ref != request.method) {
        return false;
      }
      reqparts = request.path.substr(1).split('/');
      searchparts = this.path.split('/');
      params = {};
      for (i = 0, __len = searchparts.length; i < __len; ++i) {
        part = searchparts[i];
        reqpart = reqparts.shift();
        if (part[0] === '#') {
          params[part.substr(1)] = reqpart;
        } else {
          if (reqpart !== part) {
            return false;
          }
        }
      }
      if (this.action.expects != null) {
        for (param in __ref = this.action.expects) if (__own.call(__ref, param)) {
          type = __ref[param];
          val = request.post[param] || request.get[param] || params[param] || reqparts.shift();
          params[param] = new type(val);
        }
      } else {
        __import(__import(params, request.get), request.post);
      }
      return params;
    };
    prototype.reverse = function(params){
      throw Error('unimplemented');
    };
    return Route;
  }());
  exports.Router = Router = (function(){
    Router.displayName = 'Router';
    var prototype = Router.prototype, constructor = Router;
    Router.routers = [];
    Router.route = function(req){
      var router, route, params, __i, __ref, __len, __j, __ref1, __len1, __results = [];
      for (__i = 0, __len = (__ref = this.routers).length; __i < __len; ++__i) {
        router = __ref[__i];
        for (__j = 0, __len1 = (__ref1 = router.routes).length; __j < __len1; ++__j) {
          route = __ref1[__j];
          if (params = route.match(req)) {
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
    prototype.routeHash = {};
    Object.defineProperty(prototype, 'routes', {
      get: function(){
        var k, v, __ref, __results = [];
        for (k in __ref = this.routeHash) {
          v = __ref[k];
          __results.push(v);
        }
        return __results;
      },
      configurable: true,
      enumerable: true
    });
    function Router(){
      constructor.routers.push(this);
    }
    prototype.add = __curry(function(method, path, action){
      method || (method = '*');
      return this.routeHash[method + " " + path] = method instanceof Route
        ? method
        : new Route(method, path, action);
    });
    methods.forEach(function(method){
      return prototype[method.toLowerCase()] = prototype.add(method);
    });
    prototype.any = prototype['*'];
    prototype.use = function(obj, re){
      var path, func, p, method, __ref, __this = this, __own = {}.hasOwnProperty, __results = [];
      re == null && (re = true);
      if (re && obj.reload != null) {
        obj.reload.connect(function(keys){
          return __this.use(obj, false);
        });
      }
      for (path in obj) if (__own.call(obj, path)) {
        func = obj[path];
        if (func.aliases != null) {
          for (p in __ref = func.aliases) {
            method = __ref[p];
            this.add(method, p, func);
          }
        }
        __results.push(this.add(func.method, path, func));
      }
      return __results;
    };
    return Router;
  }());
  exports.alias = function(obj, func){
    __import(func.aliases || (func.aliases = {}), obj);
    return func;
  };
  methods.forEach(function(method){
    return exports[method.toLowerCase()] = function(id, func){
      var __ref;
      if (typeof id === 'string') {
        return exports.alias((__ref = {}, __ref[id] = method, __ref), func);
      } else {
        return func.method = method, func;
      }
    };
  });
  exports.any = exports['*'];
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function __curry(f, args){
    return f.length ? function(){
      var params = args ? args.concat() : [];
      return params.push.apply(params, arguments) < f.length ?
        __curry.call(this, f, params) : f.apply(this, params);
    } : f;
  }
}).call(this);
