require("sugar");
Object.sugar();

const cluster = require("cluster"),
fs = require("fs"),
path = require("path"),
numCPUs = require('os').cpus().length,
appDir = process.cwd();

exports.run = function(base) {
	var config = exports.config = base.merge({appDir: appDir});
	exports.mvc = {
		list: require("./mvc/list.js"),
		model: require("./mvc/model.js")
	};
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
