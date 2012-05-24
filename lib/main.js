(function(){
  var Sync, Router, Controller, Loader, View, ViewLoader, Server, appDir, __ref;
  Sync = require('sync');
  Router = require("./server/router").Router;
  Controller = require("./mvc/controller").Controller;
  Loader = require("./mvc/loader").Loader;
  __ref = require("./mvc/view"), View = __ref.View, ViewLoader = __ref.ViewLoader;
  Server = require("./server/server").Server;
  exports.async = function(it){
    return it.async();
  };
  exports.future = function(it){
    return it.future();
  };
  appDir = process.cwd();
  exports.defaults = function(){
    module.exports = new Server;
    return Sync(function(){
      var Eco;
      View.add("eco", Eco = (function(){
        Eco.displayName = 'Eco';
        var prototype = Eco.prototype, constructor = Eco;
        function Eco(file){
          vm.createScript(Coco.compile('"""' + file + '"""', {
            bare: true
          }));
        }
        return Eco;
      }()));
      Controller.views(ViewLoader(appDir + "/views"));
      return (function(){
        return this.use(Loader(appDir + "/controllers"));
      }.call(new Router));
    }, __bind(module.exports, 'error'));
  };
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
