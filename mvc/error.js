(function(){
  var util, pathutil, Renderer, ErrorHandler;
  util = require('util');
  pathutil = require('pathutil');
  Renderer = require("./renderer.co");
  module.exports = ErrorHandler = (function(superclass){
    ErrorHandler.displayName = 'ErrorHandler';
    var prototype = __extend(ErrorHandler, superclass).prototype, constructor = ErrorHandler;
    function ErrorHandler(e){
      var status, _ref;
      status = (_ref = e.status) != null ? _ref : "error";
      superclass.call(this, status, e);
      this.on("error", function(){
        console.error("WE'RE DOOMED!");
        throw e;
      });
    }
    return ErrorHandler;
  }(Renderer));
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
}).call(this);
