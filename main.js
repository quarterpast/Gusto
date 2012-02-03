require("sugar");
Object.sugar();

const cluster = require("cluster"),
numCPUs = require('os').cpus().length,
appDir = process.cwd();
console.log(appDir)
exports.run = function(base) {
	var config = exports.config = base.merge({appDir: appDir});
	if(config.cluster && cluster.isMaster) {
		for (var i = 0; i < numCPUs; i++) {
			cluster.fork();
		}
		cluster.on('death', function(hamster) {
			console.log('hamster ' + hamster.pid + ' died');
			config.respawn && cluster.fork();
		});
	} else {
		require("./server.js").go();
	}
};