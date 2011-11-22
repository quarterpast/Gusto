importPackage(Packages.com.sun.net.httpserver);
importPackage(java.io);

require("extend.js").extend(Object,String,Array,Boolean,JSON);
exports.init = function(router) {
	require.paths.push(this.appDir);
	const config = JSON.parse(readFile(this.appDir+"/conf/app.conf")),
	      routes = require(appDir+"/conf/routes.js").routes.call(router,mvc.controllers()),
	      addr = new java.net.InetSocketAddress(this[this.appMode].address || "localhost", this[this.appMode].port || 8000),
	      server = HttpServer.create(addr, "backlog" in this[this.appMode] ? this[this.appMode].backlog : 10);

	server.createContext("/", router);
	server.start();
	print("Listening on "+addr);
}