(function(){
  var Config, signal, path;
  Config = require("../main").Config;
  signal = require("./signal").signal;
  path = require('path');
  exports.Renderer = async((function(){
    function Renderer(file){
      var ext, eng, filename, _ref, _results = [];
      for (ext in _ref = Config.engines) {
        eng = _ref[ext];
        filename = path.join(Config.templatePath, file + "." + ext);
        if (path.exists.sync(null, filename)) {
          _results.push(eng.compile(filename));
        }
      }
      return _results;
    }
    return Renderer;
  }()));
}).call(this);
