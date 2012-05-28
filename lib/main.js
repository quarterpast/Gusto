(function(){
  var Sync, path, appDir;
  Sync = require('sync');
  path = require('path');
  appDir = process.cwd();
  exports.defaults = function(){
    var Router, Controller, Loader, View, ViewLoader, Server, server, __ref;
    Router = require("./server/router").Router;
    Controller = require("./mvc/controller").Controller;
    Loader = require("./mvc/loader").Loader;
    __ref = require("./mvc/view"), View = __ref.View, ViewLoader = __ref.ViewLoader;
    Server = require("./server/server").Server;
    server = new Server;
    Sync(function(){
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
      Controller.views(ViewLoader(path.join(appDir, "views")));
      return (function(){
        return this.use(Loader(path.join(appDir, "controllers")));
      }.call(new Router));
    }, __bind(server, 'error'));
    return server;
  };
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
