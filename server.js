exports.write = function() {

};
const config = require.main.exports.config,
http = require("http"),
router = require("router.js"),
staticroute = require("staticroute.js"),
list = require("mvc/list.js"),
routes = require(config.appDir+"/conf/routes.js").call(staticroute,list.controllers()),
server = http.createServer(function(req,res) {
	
	//@TODO: parse headers, request body
	routes.filter(require("router.js").bind(null,req));
	//@TODO: write out the content
}),
port = config[config.appMode].port || 8000;

exports.go = function() {
	if("address" in config[config.appMode]) {
		server.listen(
			port,
			config[config.appMode].address,
			console.log.bind(null,
				"Listening on %s:%d",
				config[config.appMode].address,
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
};