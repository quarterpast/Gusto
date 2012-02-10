require("sugar");// library with sweet API additions
Object.extend(); // attach things to Object.prototype

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
	
	exports.mvc = {// so the app can use them
		list: require("./mvc/list.js"),
		model: require("./mvc/model.js")
	};
	// if the app wants us to fork and this is the master process...
	if(config.cluster && cluster.isMaster) {
		for (var i = 0; i < numCPUs; i++) {
			fork();
		}
		cluster.on('death', function(hamster) {
			// log the deaths of any child processes
			console.log('hamster ' + hamster.pid + ' died');
			fs.unlink(path.join("pids.d",hamster.pid.toString()));
			// and, if the app wants, respawn it
			config.respawn && fork();
		});
	} else {
		// this is a child process, or we're not forking
		// either way, init and run the server
		require("./server/server.js").go();
	}
};
