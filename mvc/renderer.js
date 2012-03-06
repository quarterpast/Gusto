(function(){
  var extentions, list, config, fs, pathutil, tmpl, Renderer;
  extentions = require("./template.co");
  list = require("./list.co");
  config = require("../main.co").config;
  fs = require('fs');
  pathutil = require('path');
  tmpl = require('tmpl');
  module.exports = Renderer = (function(superclass){
    Renderer.displayName = 'Renderer';
    var prototype = __extend(Renderer, superclass).prototype, constructor = Renderer;
    function Renderer(path, args, action, layout, ajax){
      var resolved, old;
      resolved = pathutil.join(config.appDir, 'app', 'views', path + ".ejs");
      old = path;
      fs.readFile(resolved, function(err, data){
        var compiled, ctx, _ref;
        if (err) {
          throw err;
        }
        if (ajax) {
          return this.emit('render', data);
        }
        try {
          compiled = tmpl.compile(data.toString(), resolved);
        } catch (e) {
          console.error("compilation error", e.stack);
          return this.emit('error', e);
        }
        ctx = (_ref = __clone(args), _ref._ = list.controllers, _ref.$ = (extentions.action = action, extentions.layout = layout, extentions.extend = function(it){
          var path;
          return path = it;
        }, extentions.set = function(k, v){
          return args[k] = v;
        }, extentions.get = function(it){
          return args[it];
        }, extentions.exists = function(it){
          return it in args;
        }, extentions), _ref);
        return comp.execute(ctx, function(output){
          var _this = this;
          if (old !== path) {
            return new Renderer(path, args, action, output, false).on('render', function(it){
              return _this.emit('render', it);
            }).on('error', function(it){
              return _this.emit('error', it);
            });
          } else {
            return this.emit('render', output);
          }
        });
      });
    }
    return Renderer;
  }(EventEmitter));
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function __clone(it){
    function fun(){} fun.prototype = it;
    return new fun;
  }
}).call(this);
