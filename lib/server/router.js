(function(){
  var Config, Controllers, url, vm, methods, Script, InvalidMethod, NoAction, Generic, Router, __slice = [].slice;
  Config = require("../main").Config;
  Controllers = require("../mvc/controller").Controllers;
  url = require('url');
  vm = require('vm');
  methods = ['*', 'HEAD', 'GET', 'POST', 'PUT', 'TRACE', 'DELETE', 'OPTIONS', 'PATCH'];
  Script = (function(){
    Script.displayName = 'Script';
    var prototype = Script.prototype, constructor = Script;
    function Script(text){
      this.text = text;
      this.script = vm.createScript(this.compiled = Coco.compile(this.text, {
        bare: true
      }));
    }
    prototype.runInNewContext = function(){
      return __bind(this.script, 'runInNewContext').apply(this, arguments);
    };
    prototype.runInContext = function(){
      return __bind(this.script, 'runInContext').apply(this, arguments);
    };
    prototype.runInThisContext = function(){
      return __bind(this.script, 'runInThisContext').apply(this, arguments);
    };
    return Script;
  }());
  exports.Errors = {};
  exports.Errors.InvalidMethod = InvalidMethod = (function(superclass){
    InvalidMethod.displayName = 'InvalidMethod';
    var prototype = __extend(InvalidMethod, superclass).prototype, constructor = InvalidMethod;
    function InvalidMethod(m){
      superclass.call(this, "Invalid HTTP method " + m);
    }
    return InvalidMethod;
  }(Error));
  exports.Errors.NoAction = NoAction = (function(superclass){
    NoAction.displayName = 'NoAction';
    var prototype = __extend(NoAction, superclass).prototype, constructor = NoAction;
    function NoAction(it){
      superclass.call(this, "No such action " + it);
    }
    return NoAction;
  }(Error));
  exports.Errors.Generic = Generic = (function(superclass){
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
    prototype.compiled = [];
    function Router(){
      var data, line, parts, _res, _i, _ref, _len;
      this.controllers = Controllers.run();
      data = fs.readFile.sync(fs, Config.routes);
      _res = [];
      for (_i = 0, _len = (_ref = data.toString().split(/[\n\r]/)).length; _i < _len; ++_i) {
        line = _ref[_i];
        line = line.split("#").shift();
        if (line) {
          parts = line.split(/\s+/);
          if (parts.length > 2) {
            if (!__of(parts[0], methods)) {
              throw new exports.Errors.InvalidMethod(parts[0]);
            }
            parts['method'] = parts[0], parts['path'] = parts[1], parts['id'] = parts[2], parts['args'] = __slice.call(parts, 3);
            parts.id = new Script('"' + parts.id + '"');
            parts.args = new Script(parts.args.join(" "));
            _res.push(parts);
          }
        }
      }
      this.compiled = _res;
    }
    prototype.route = function(req){
      var uri, route, keys, pieces, reg, params, id, action, _i, _ref, _len;
      uri = url.parse(req.path);
      for (_i = 0, _len = (_ref = this.compiled).length; _i < _len; ++_i) {
        route = _ref[_i];
        if (!(route.method === "*" || route.method === req.method)) {
          continue;
        }
        keys = [];
        pieces = route.path.replace(/#\{([\w]+?)(\|[\s\S]+?)?(\/)?\}/g, _fn);
        reg = RegExp('^' + pieces + '$');
        if (reg.test(uri.pathname)) {
          params = {};
          uri.pathname.replace(reg, _fn2);
          if (!(id = route.id.runInNewContext(params))) {
            continue;
          }
          if (!(action = Controllers.byId(id))) {
            continue;
          }
          return {
            action: action,
            params: params
          };
        }
      }
      function _fn(m, key, sub, slash){
        keys.push(key);
        if (sub) {
          return sub.substr(1);
        } else if (slash === '/') {
          return '((\\/?[^\\/?*:;{}\\\\]+)+)';
        } else {
          return '([\\w0-9.-]+)';
        }
      }
      function _fn2(m){
        var vals, i, key, _ref, _len, _results = [];
        vals = __slice.call(arguments, 1);
        for (i = 0, _len = (_ref = keys).length; i < _len; ++i) {
          key = _ref[i];
          _results.push(params[key] = vals[i]);
        }
        return _results;
      }
    };
    return Router;
  }());
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function __of(x, arr){
    var i = 0, l = arr.length >>> 0;
    while (i < l) if (x === arr[i++]) return true;
    return false;
  }
}).call(this);
