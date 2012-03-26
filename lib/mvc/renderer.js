(function(){
  var Config, path, Q, Renderer;
  Config = require("../main").Config;
  path = require('path');
  Q = require('q');
  Renderer = (function(){
    Renderer.displayName = 'Renderer';
    var prototype = Renderer.prototype, constructor = Renderer;
    function Renderer(file){
      var ext, eng, _ref;
      for (ext in _ref = Config.engines) {
        eng = _ref[ext];
        Q.ncall(path.exists, path, path.join(Config.templatePath, file + "." + ext)).then(_fn);
      }
      function _fn(exists){
        if (exists) {
          return Q.ncall(fs.readFile, fs, path.join(Config.templatePath, file + "." + ext)).then(function(data){});
        }
      }
    }
    return Renderer;
  }());
}).call(this);
