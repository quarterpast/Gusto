(function(){
  var url, list, instance, staticRoute, redirect;
  url = require('url');
  list = require("../mvc/list.co");
  instance = require("../mvc/instance.co");
  staticRoute = require("./static.co");
  redirect = require("./redirect.co");
  module.exports = function(req, res, route){
    var params, keys, uri, reg, env, action, id, bits, methods, run, _ref;
    params = {};
    keys = [];
    uri = url.parse(req.url, true);
    if (route[0] === "*" || route[0] === req.method) {
      reg = new RegExp("^" + route[1].replace(/\{([\w]+?)(\|[\s\S]+?)?(\/)?\}/g, function(m, key, sub, slash){
        keys.push(key);
        if (sub) {
          return sub.substr(1);
        } else if (slash === '/') {
          return "((/?[^/?*:;{}\\\\]+)+)";
        } else {
          return "([\\w0-9.-]+)";
        }
      }), +"$");
      if (reg.test(uri.pathname)) {
        uri.pathname.replace(reg, function(m){
          var i, _to, _results = [];
          for (i = 1, _to = keys.length; i <= _to; ++i) {
            _results.push(params[keys[i - 1]] = arguments[i]);
          }
          return _results;
        });
        env = (_ref = __import(__clone(list.controllers), params), _ref['static'] = staticRoute, _ref.redirect = redirect, _ref);
        try {
          action = route[2].runInNewContext(env);
        } catch (e) {
          if (e.name === '"TypeError"') {
            return;
          } else {
            throw e;
          }
        }
        if (!action) {
          return null;
        }
        id = action.id;
        bits = id.split('.');
        run = id === "static.file" || id === "static.dir" || id === "static.url" || id === "static.template" || id === "redirect"
          ? action.fill(req, res, route[3])
          : (methods = instance(res, bits[0], bits[1]), action.bind(__import(action.context, methods)));
        run.params = params;
        return run;
      }
    }
  };
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function __clone(it){
    function fun(){} fun.prototype = it;
    return new fun;
  }
}).call(this);
