(function(){
  var Config, status, url, methods, everyMethod, Aliases, c, Route, Router, __slice = [].slice;
  Config = require("../main").Config;
  status = require("./status");
  url = require('url');
  methods = ['head', 'get', 'post', 'put', 'trace', 'delete', 'options', 'patch'];
  everyMethod = __partialize(map, [void 8, methods], [0]);
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
  c = 0;
  exports.Route = Route = (function(){
    Route.displayName = 'Route';
    var prototype = Route.prototype, constructor = Route;
    function Route(method, path, action){
      this.method = method != null ? method : '*';
      this.path = path;
      this.action = action;
      this.method = this.method.toUpperCase();
      action.toString = action.route = __bind(this, 'reverse');
    }
    prototype.equals = function(other){
      return andList(zipWith(__curry(function(__x, __y){
        return __x === __y;
      }), [this['method'], this['path']], [other['method'], other['path']]));
    };
    prototype.toString = function(){
      return this.method.toUpperCase() + " " + this.path;
    };
    prototype.match = function(request){
      var __ref;
      if ((__ref = this.method) != '*' && __ref != request.method) {
        return false;
      }
      return andList(zipWith(function(reqpart, part){
        switch (false) {
        case !head(part === ":"):
          return true;
        default:
          return reqpart === part;
        }
      }, tail(request.path).split('/'), this.path.split('/')));
    };
    prototype.toResponse = function(request, time){
      var params, param, type, val, body, __ref, __own = {}.hasOwnProperty;
      params = {};
      zipWith(function(reqpart, part){
        switch (false) {
        case !head(part === ":"):
          return params[tail(part)] = reqpart;
        }
      }, tail(request.path).split('/'))(
      this.path.split("/"));
      if (this.action.expects != null) {
        for (param in __ref = this.action.expects) if (__own.call(__ref, param)) {
          type = __ref[param];
          val = request.post[param] || request.get[param] || params[param] || reqparts.shift();
          params[param] = new type(val);
        }
      } else {
        __import(__import(params, request.get), request.post);
      }
      body = this.action(params);
      return __import(__clone({
        headers: {
          "content-type": "text/html"
        },
        status: 200,
        onclose: __bind(time, 'end')
      }), 'forEach' in body ? {
        body: body
      } : body);
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
      var that;
      switch (that = concatMap(function(it){
        return it.route(req);
      }, this.routers)) {
      case empty(that):
        return status[404](req.path);
      default:
        return head(that);
      }
    };
    prototype.routes = [];
    function Router(){
      constructor.routers.push(this);
    }
    prototype.route = function(req){
      return filter(function(it){
        return it.match(req);
      }, this.routes);
    };
    prototype.register = __curry(function(method, path, action){
      var route, that;
      switch (false) {
      case !(__in(method.toLowerCase(), '*') || arguments || methods):
        route = new Route(method, path, action);
        if (that = find(function(it){
          return it.equals(route);
        }, this.routes)) {
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
  function __partialize(f, args, where){
    return function(){
      var params = __slice.call(arguments), i,
          len = params.length, wlen = where.length,
          ta = args ? args.concat() : [], tw = where ? where.concat() : [];
      for(i = 0; i < len; ++i) { ta[tw[0]] = params[i]; tw.shift(); }
      return len < wlen && len ? __partialize(f, ta, tw) : f.apply(this, ta);
    };
  }
  function __curry(f, args){
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      return params.push.apply(params, arguments) < f.length && arguments.length ?
        __curry.call(this, f, params) : f.apply(this, params);
    } : f;
  }
  function __bind(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function __clone(it){
    function fun(){} fun.prototype = it;
    return new fun;
  }
  function __in(x, arr){
    var i = 0, l = arr.length >>> 0;
    while (i < l) if (x === arr[i++]) return true;
    return false;
  }
}).call(this);
