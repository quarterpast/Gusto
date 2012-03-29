(function(){
  var Config, async, path, exists, Renderer, _ref;
  _ref = require("../main"), Config = _ref.Config, async = _ref.async;
  path = require('path');
  exists = function(p, cb){
    return path.exists(p, function(e){
      return cb(null, e);
    });
  };
  exports.Renderer = Renderer = (function(){
    Renderer.displayName = 'Renderer';
    var prototype = Renderer.prototype, constructor = Renderer;
    Renderer.resolve = async(function(file){
      var ext, eng, filename, _ref;
      for (ext in _ref = Config.engines) {
        eng = _ref[ext];
        filename = path.join(Config.templatePath, file + "." + ext);
        if (exists.sync(null, filename)) {
          return eng.compile.sync(eng, filename);
        }
        filename = path.join(Config.templatePath, file + "", "index." + ext);
        if (exists.sync(null, filename)) {
          return eng.compile.sync(eng, filename);
        }
      }
      throw new Error("No template for " + file);
    });
    function Renderer(){}
    return Renderer;
  }());
}).call(this);
