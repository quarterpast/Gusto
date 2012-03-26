(function(){
  var Config, signal, path, Q, Renderer;
  Config = require("../main").Config;
  signal = require("./signal").signal;
  path = require('path');
  Q = require('q');
  exports.Renderer = Renderer = (function(superclass){
    Renderer.displayName = 'Renderer';
    var prototype = __extend(Renderer, superclass).prototype, constructor = Renderer;
    function Renderer(file){
      var ext, eng, filename, _ref;
      for (ext in _ref = Config.engines) {
        eng = _ref[ext];
        filename = path.join(Config.templatePath, file + "." + ext);
        path.exists(filename, _fn);
      }
      function _fn(exists){
        if (exists) {
          return eng.compile(filename);
        }
      }
    }
    return Renderer;
  }(Q.makePromise));
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
}).call(this);
