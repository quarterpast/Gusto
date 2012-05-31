(function(){
  var Sync, path, vm, appDir;
  Sync = require('sync');
  path = require('path');
  vm = require('vm');
  appDir = process.cwd();
  exports.defaults = function(){
    var Router, Controller, ControllerLoader, View, ViewLoader, Server, Log, prof, server, __ref;
    Router = require("./server/router").Router;
    __ref = require("./mvc/controller"), Controller = __ref.Controller, ControllerLoader = __ref.ControllerLoader;
    __ref = require("./mvc/view"), View = __ref.View, ViewLoader = __ref.ViewLoader;
    Server = require("./server/server").Server;
    Log = require("./log").Log;
    prof = require('v8-profiler');
    prof.startProfiling('default');
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
    }, function(e){
      if (e) {
        Log.error(e.message);
        console.log(e.stack);
        return process.exit(e.code || 1);
      }
    });
    prof.stopProfiling('default');
    return server;
  };
}).call(this);
