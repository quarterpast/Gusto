(function(){
  var Sync, path, appDir;
  Sync = require('sync');
  path = require('path');
  appDir = process.cwd();
  exports.defaults = function(){
    var Router, Controller, ControllerLoader, View, ViewLoader, Server, server, __ref;
    Router = require("./server/router").Router;
    __ref = require("./mvc/controller"), Controller = __ref.Controller, ControllerLoader = __ref.ControllerLoader;
    __ref = require("./mvc/view"), View = __ref.View, ViewLoader = __ref.ViewLoader;
    Server = require("./server/server").Server;
    server = new Server;
    Sync(function(){
      var Eco, Ejs;
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
      View.add("ejs", Ejs = (function(){
        Ejs.displayName = 'Ejs';
        var prototype = Ejs.prototype, constructor = Ejs;
        function Ejs(file){
          vm.createScript(file);
        }
        return Ejs;
      }()));
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
