importPackage(Packages.com.sun.net.httpserver);
importPackage(java.io);

require("extend.js").extend(Object,String,Array);
exports.init = function(appDir,appMode) {
	require.paths.push(appDir);
	const config = JSON.parse(readFile(appDir+"/conf/app.conf")),
	      mvc = require("mvc.js").init(),
	      router = require("router.js"),
	      routes = require(appDir+"/conf/routes.js").routes.call(router,mvc.controllers());
	      addr = new java.net.InetSocketAddress(config[appMode].address || "localhost", config[appMode].port || 8000),
	      server = HttpServer.create(addr, 10);

	server.createContext("/", function(htex) {
		try {
			var status = 404, type = "text/html",binary=false;
			mvc.setBuffer(new java.lang.StringBuilder());
			for each(let route in routes) {
				let params = {}, keys = [], [uri,query] = new String(htex.getRequestURI()).split("?");
				if(Object.isglobal(query)) query = "";
				if(!route[0] === "*" && !route[0] === htex.getRequestMethod())
					continue;
				if(htex.getRequestMethod() == "POST")
					print(htex.getRequestBody())
				let reg = new RegExp("^"+route[1].replace(/\{([\w]+?)\}/g,function(m,key){
					keys.push(key)
					return "([\\w0-9\.]+)";
				})+"$");
				if(!reg.test(uri))
					continue;
				uri.replace(reg,function(m){
					Array.slice(arguments,1,keys.length+1).forEach(function(v,k){
						params[keys[k]] = v;
					})
				});
				if(route[2] === router.staticFile || route[2] === router.staticDir)
					route[2] = route[2](route[3]);
				if(!Object.isFunction(route[2](params)))
					continue;
				out = route[2](params)(Object.extend(params,query.parseQuery()));
				out = Object.isglobal(out) ? {} : out;
				type = "type" in out ? out.type : type;
				status = "status" in out ? out.status : 200;
				binary = "binary" in out ? out.binary : false;
				print(htex.getRequestMethod(),uri,status,type,binary?"binary":"text")
				break;
			}
		} catch(e) {
			mvc.getBuffer().append(e);
		} finally {
			htex.getResponseHeaders().add("Content-type",type);
			if(binary) {
				htex.sendResponseHeaders(status,mvc.getBytes().length);
				htex.getResponseBody().write(mvc.getBytes());
			} else {
				htex.sendResponseHeaders(status,mvc.getBuffer().length());
				htex.getResponseBody().write(mvc.getBuffer().toString().getBytes());
			}
			htex.close();
		}
	});
	server.start();
	print("Listening on "+addr);
}