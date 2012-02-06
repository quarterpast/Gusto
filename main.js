require("sugar");
Object.extend();

const cluster = require("cluster"),
fs = require("fs"),
path = require("path"),
numCPUs = require('os').cpus().length,
appDir = process.cwd(),
pidFile = path.join(appDir,"struct.pid");


exports.run = function(base) {
	function fork() {
		var pid = cluster.fork().pid.toString();
		fs.open(path.join("pids.d",pid),"w");
	}
	var config = exports.config = base.merge({appDir: appDir});
	
	exports.mvc = {
		list: require("mvc/list.js"),
		model: require("mvc/model.js")
	};
	if(config.cluster && cluster.isMaster) {
		for (var i = 0; i < numCPUs; i++) {
			fork();
		}
		cluster.on('death', function(hamster) {
			console.log('hamster ' + hamster.pid + ' died');
			fs.unlink(path.join("pids.d",hamster.pid.toString()));
			config.respawn && fork();
		});
	} else {
		require("server/server.js").go();
	}
};
