(function(){
  var Sync, path, vm, appDir;
  Sync = require('sync');
  path = require('path');
  vm = require('vm');
  appDir = process.cwd();
  exports.defaults = function(){
    var Router, Controller, ControllerLoader, View, ViewLoader, Server, server, __ref;
    Router = require("./server/router").Router;
    __ref = require("./mvc/controller"), Controller = __ref.Controller, ControllerLoader = __ref.ControllerLoader;
    __ref = require("./mvc/view"), View = __ref.View, ViewLoader = __ref.ViewLoader;
    Server = require("./server/server").Server;
    server = new Server;
    Sync(function(){
      View.add("eco", function(file){
        return vm.createScript(Coco.compile('["""' + file + '"""]', {
          bare: true
        }));
      });
      View.add("ejs", function(file){
        return vm.createScript(file);
      });
      Controller.views(ViewLoader(path.join(appDir, "views")));
      return (function(){
        return this.use(ControllerLoader(path.join(appDir, "controllers")));
      }.call(new Router));
    }, __bind(server, 'error'));
    return server;
  };
  function __bind(obj, key){
    return function(){ return obj[key].apply(obj, arguments) };
  }
}).call(this);
