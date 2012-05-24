(function(){
  var Router, Controller, Loader, View, ViewLoader, controllers, __ref;
  Router = require("server/router").Router;
  Controller = require("mvc/controller").Controller;
  Loader = require("mvc/loader").Loader;
  __ref = require("mvc/view"), View = __ref.View, ViewLoader = __ref.ViewLoader;
  controllers = new Router;
  controllers.use(Loader(appDir + "/controllers"));
}).call(this);
