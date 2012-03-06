(function(){
  var cluster, fs, path, numCPUs, appDir, pidFile;
  require('sugar');
  Object.extend();
  cluster = require('cluster');
  fs = require('fs');
  path = require('path');
  numCPUs = require('os').cpus().length;
  appDir = process.cwd();
  pidFile = path.join(appDir, "struct.pid");
  exports.run = function(base){
    var fork, config, i, _to;
    fork = function(){
      var pid;
      pid = cluster.fork().pid.toString();
      return fs.open(path.join("pids.d", pid), "w");
    };
    config = exports.config = base.merge({
      appDir: appDir
    });
    exports.mvc = {
      list: require("./mvc/list.js"),
      model: require("./mvc/model.js")
    };
    if (config.cluster && cluster.isMaster) {
      for (i = 0, _to = numCPUs; i < _to; ++i) {
        fork();
      }
      return cluster.on['death'](function(hamster){
        console.log('hamster #{hamster.pid} died');
        fs.unlink(path.join("pids.d", hamster.pid.toString()));
        if (config.respawn) {
          return fork();
        }
      });
    } else {
      return require("./server/server.js").go();
    }
  };
}).call(this);
