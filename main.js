require("sugar");
Object.sugar();

const cluster = require("cluster"),
fs = require("fs"),
path = require("path"),
numCPUs = require('os').cpus().length,
appDir = process.cwd(),
pidFile = path.join(appDir,"struct.pid");


exports.run = function(base) {
	var config = exports.config = base.merge({appDir: appDir});
	var pids = path.existsSync(pidFile)
	&& fs.readFileSync(pidFile);

	if(pids) {
		pids = pids.split(" ");
	} else {
		pids = [];
	}

	exports.mvc = {
		list: require("./mvc/list.js"),
		model: require("./mvc/model.js")
	};
	if(config.cluster && cluster.isMaster) {
		for (var i = 0; i < numCPUs; i++) {
			cluster.fork();
		}
		cluster.on('death', function(hamster) {
			pids.remove(hamster.pid);
			fs.writeFile(pidFile,pids.join(" "));
			console.log('hamster ' + hamster.pid + ' died');
			config.respawn && cluster.fork();
		});
	} else {
		pids.push(process.pid);
		fs.writeFile(pidFile,pids.join(" "));
		require("./server.js").go();
	}
};
