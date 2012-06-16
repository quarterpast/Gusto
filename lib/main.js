(function(){
  var Sync, path, vm, LiveScript;
  Sync = require('sync');
  path = require('path');
  vm = require('vm');
  LiveScript = require('LiveScript');
  __import(this, require('prelude-ls'));
  exports.defaults = function(appDir){
    var Router, Controller, ControllerLoader, View, ViewLoader, Server, Log, Static, server, __ref;
    appDir == null && (appDir = process.cwd());
    Router = require("./server/router").Router;
    __ref = require("./mvc/controller"), Controller = __ref.Controller, ControllerLoader = __ref.ControllerLoader;
    __ref = require("./mvc/view"), View = __ref.View, ViewLoader = __ref.ViewLoader;
    Server = require("./server/server").Server;
    Log = require("./log").Log;
    Static = require("./server/static");
    server = new Server;
    Sync(function(){
      View.add("els", function(file){
        return vm.createScript(LiveScript.compile('["""' + file + '"""]', {
          bare: true
        }));
      });
      View.add("ejs", function(file){
        return vm.createScript(file);
      });
      Controller.views(ViewLoader(path.join(appDir, "views")));
      return (function(){
        this.use(ControllerLoader(path.join(appDir, "controllers")));
        return this.use(Static.dir("static", path.join(appDir, "static")));
      }.call(new Router));
    }, function(e){
      if (e) {
        Log.error(e.message);
        console.log(e.stack);
        return process.exit(e.code || 1);
      }
    });
    return server;
  };
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
