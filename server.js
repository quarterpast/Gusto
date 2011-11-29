importPackage(Packages.com.sun.net.httpserver);
importPackage(java.io);

const router = require("router.js").router,
staticroute = require("staticroute.js"),
list = require("mvc/list.js");

exports.init = function(config) {
	require.paths.push(config.appDir);
	const routes = require(config.appDir+"/conf/routes.js").routes.call(staticroute,list.controllers()),
	      addr = new java.net.InetSocketAddress(config[config.appMode].address || "localhost", config[config.appMode].port || 8000),
	      server = HttpServer.create(addr, config[config.appMode].backlog || 10);

	server.createContext("/", router);
	server.start();
	print("Listening on "+addr);
}