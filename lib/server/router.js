(function(){
  var Config, signal, url, methods, fill, everyMethod, NotFound, Aliases, Route, Router, __slice = [].slice, __equals = __curry(function(x, y){ return x === y; });
  Config = require("../main").Config;
  signal = require("../mvc/signal").signal;
  url = require('url');
  methods = ['head', 'get', 'post', 'put', 'trace', 'delete', 'options', 'patch'];
  fill = __curry(function(args, func){
    return __curry(function(){
      var params, i, that;
      params = __slice.call(arguments);
      return func.apply(null, (function(){
        var __to, __results = [];
        for (i = 0, __to = maximum([(params.length)].concat(keys(args))); i <= __to; ++i) {
          if ((that = args[i]) != null) {
            __results.push(that);
          } else if (that = params.shift()) {
            __results.push(that);
          } else {
            __results.push(void 8);
          }
        }
        return __results;
      }()));
    });
  });
  everyMethod = fill({
    1: methods
  }, map);
  exports.NotFound = NotFound = (function(superclass){
    NotFound.displayName = 'NotFound';
    var prototype = __extend(NotFound, superclass).prototype, constructor = NotFound;
    function NotFound(it){
      superclass.call(this, "Could not route " + it);
    }
    return NotFound;
  }(Error));
  Aliases = (function(){
    Aliases.displayName = 'Aliases';
    var prototype = Aliases.prototype, constructor = Aliases;
    everyMethod(function(m){
      return prototype[m] = [];
    });
    prototype.add = function(obj){
      var m, url, __this = this, __results = [];
      switch (false) {
      case typeof obj !== 'string':
        return everyMethod(function(m){
          return __this[m].unshift(obj);
        });
      default:
        for (m in obj) {
          url = obj[m];
          __results.push(this[m].unshift(url));
        }
        return __results;
      }
    };
    prototype.setMethod = __curry(function(skip){
      var __this = this;
      return everyMethod(function(m){
        switch (false) {
        case m === skip:
          return __this[m] = [];
        }
      });
    });
    function Aliases(){}
    return Aliases;
  }());
  exports.Route = Route = (function(){
    Route.displayName = 'Route';
    var prototype = Route.prototype, constructor = Route;
    function Route(method, path, action){
      this.method = method != null ? method : '*';
      this.path = path;
      this.action = action;
      action.toString = action.route = __bind(this, 'reverse');
    }
    prototype.equals = function(other){
      return all(id, zipWith(__equals, [this['method'], this['path']], [other['method'], other['path']]));
    };
    prototype.toString = function(){
      return this.method.toUpperCase() + " " + this.path;
    };
    prototype.match = function(request){
      var reqparts, searchparts, params, i, part, reqpart, param, type, val, __ref, __len, __own = {}.hasOwnProperty;
      if ((__ref = this.method.toLowerCase()) != '*' && __ref != request.method) {
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
  exports.alias = function(obj, func){
    var __ref;
    ((__ref = func.aliases) != null
      ? __ref
      : func.aliases = new Aliases).add(obj);
    return func;
  };
  everyMethod(function(method){
    return exports[method] = function(id, func){
      var __ref;
      switch (false) {
      case typeof id !== 'string':
        return exports.alias((__ref = {}, __ref[method] = id, __ref), func);
      default:
        ((__ref = id.aliases) != null
          ? __ref
          : id.aliases = new Aliases).setMethod(method);
      }
      return id;
    };
  });
  exports.Router = Router = (function(){
    Router.displayName = 'Router';
    var prototype = Router.prototype, constructor = Router;
    Router.routers = [];
    Router.route = function(req){
      return concatMap(function(router){
        return map(function(route){
          var that;
          console.log(route + "");
          if (that = route.match(req)) {
            return {
              action: route.action,
              params: that
            };
          } else {
            return new NotFound(req.url);
          }
        }, router.routes);
      }, this.routers);
    };
    prototype.routes = [];
    function Router(){
      constructor.routers.push(this);
    }
    prototype.register = __curry(function(method, path, action){
      var route, eq, that;
      switch (false) {
      case !__in(method.toLowerCase(), [('*')].concat(methods)):
        route = new Route(method, path, action);
        eq = __bind(route, 'equals');
        if (that = find(eq, this.routes)) {
          return that.action = route.action, route;
        } else {
          return this.routes.push(route);
        }
        break;
      default:
        throw new Error("invalid method " + method);
      }
    });
    prototype.add = function(path, action){
      var __this = this;
      if (action.aliases != null) {
        zipWith(function(method, paths){
          return each(function(it){
            return __this.register(method, it, action);
          }, paths);
        }, methods, everyMethod(action.aliases));
      }
      return __bind(this, 'register')('*', path, action);
    };
    everyMethod(function(method){
      return prototype[method] = prototype.register(method);
    });
    prototype.use = function(obj, re){
      var path, func, __this = this, __own = {}.hasOwnProperty, __results = [];
      re == null && (re = true);
      if (re && obj.reload != null) {
        obj.reload.connect(function(){
          return __this.use(obj, false);
        });
      }
      for (path in obj) if (__own.call(obj, path)) {
        func = obj[path];
        __results.push(this.add(path, func));
      }
      return __results;
    };
    return Router;
  }());
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
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function __in(x, arr){
    var i = 0, l = arr.length >>> 0;
    while (i < l) if (x === arr[i++]) return true;
    return false;
  }
}).call(this);
