(function(){
  var Config, url, methods, InvalidMethod, NotFound, Generic, Router;
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
  exports.Router = Router = (function(){
    Router.displayName = 'Router';
    var prototype = Router.prototype, constructor = Router;
    prototype.routes = [];
    function Router(){}
    prototype.add = function(method, path, action){};
    prototype.get = prototype.add.curry('GET');
    prototype.post = prototype.add.curry('POST');
    return Router;
  }());
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
}).call(this);
