const config = require.main.exports.config,
http = require("http"),
router = require("router.js"),
staticroute = require("staticroute.js"),
list = require("mvc/list.js");

modules.exports = function() {
	const routes = require(config.appDir+"/conf/routes.js").call(staticroute,list.controllers()),
	      server = http.createServer(router),
	      port = config[config.appDir].port || 8000;
	if("address" in config[config.appDir]) {
		server.listen(
			port,
			config[config.appDir].address,
			console.log.bind(null,
				"Listening on %s:%d",
				config[config.appDir].address,
				port
			)
		);
	} else {
		server.listen(
			port,
			console.log.bind(null,
				"Listening on *:%d",
				port
			)
		);
	}
}