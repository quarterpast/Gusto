(function(){
  var Config, path, Q, Renderer;
  Config = require("../main").Config;
  path = require('path');
  Q = require('q');
  Renderer = (function(){
    Renderer.displayName = 'Renderer';
    var prototype = Renderer.prototype, constructor = Renderer;
    function Renderer(file){}
    return Renderer;
  }());
}).call(this);
