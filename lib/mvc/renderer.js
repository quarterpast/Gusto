(function(){
  var Config, async, path, exists, _ref;
  _ref = require("../main"), Config = _ref.Config, async = _ref.async;
  path = require('path');
  exists = function(p, cb){
    return path.exists(p, function(e){
      return cb(null, e);
    });
  };
  exports.Renderer = async((function(){
    function Renderer(file){
      var ext, eng, filename, _ref;
      for (ext in _ref = Config.engines) {
        eng = _ref[ext];
        filename = path.join(Config.templatePath, file + "." + ext);
        if (exists.sync(null, filename)) {
          return eng.compile.sync(eng, filename);
        }
      }
    }
    return Renderer;
  }()));
}).call(this);
