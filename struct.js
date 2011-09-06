importPackage(Packages.com.sun.net.httpserver);
require("extend.js").extend(Object,String,Array);
var buffer;
const addr = new java.net.InetSocketAddress("localhost", 8000),
      server = HttpServer.create(addr, 10),
      mvc = require("mvc.js").init(),
      routes = require("conf/routes.js").routes(mvc.controllers());


server.createContext("/", function(htex) {
	try {
		mvc.setBuffer(new java.lang.StringBuilder());
		for each(let route in routes) {
			let params = {}, keys = [], [uri,query] = new String(htex.getRequestURI()).split("?");
			if(Object.isglobal(query)) query = "";
			if(!route[0] === "*" && !route[0] === htex.getRequestMethod())
				continue;
			let reg = new RegExp("^"+route[1].replace(/\{(\w+)\}/g,function(m,key){
				keys.push(key)
				return "([\\w0-9]+)";
			})+"$");
			if(!reg.test(uri))
				continue;
			uri.replace(reg,function(m){
				Array.slice(arguments,1,keys.length+1).forEach(function(v,k){
					params[keys[k]] = v;
				})
			});
			if(!Object.isFunction(route[2](params)))
				continue;
			route[2](params)(Object.extend(params,query.parseQuery()));
			break;
		}
		htex.sendResponseHeaders(200,mvc.getBuffer().length());
		htex.getResponseBody().write(mvc.getBuffer().toString().getBytes());
		htex.close();
	} catch(e) {
		print(e);
	}
});
server.start();
print("oh hai")