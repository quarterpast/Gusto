importPackage(Packages.com.sun.net.httpserver);
importPackage(java.io);
require("extend.js").extend(Object,String,Array);
const appDir = environment['user.dir'],
      config = Object.extend(JSON.parse(readFile(appDir+"/conf/app.conf")),{appDir: appDir}),
      readBytes = function(file) {
      	if(!file instanceof File) {
      		throw new TypeError("are you high?");
      	}
      	if(file.exists()) {
      		let stream = new FileInputStream(file),
      		    length = file.length(),
      		    bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, length),
      		    offset = 0,
      		    numRead = 0;
      		while (offset < bytes.length
      			&& (numRead=stream.read(bytes, offset, bytes.length-offset)) >= 0) {
      			offset += numRead;
      		}
      		stream.close();
      		return bytes;
      	} else return false;
      },
      addr = new java.net.InetSocketAddress(config.address || "localhost", config.port || 8000),
      server = HttpServer.create(addr, 10),
      mvc = require("mvc.js").init(),
      routeEnv = {
      	staticDir: function(dir) {return function(vars) {return function() {
      		var file = new File(dir+"/"+vars.file), bytes;
      		if(bytes = readBytes(file)) {
      			mvc.getBuffer().append(new java.lang.String(bytes));
      			return {status:200,type:(new javax.activation.MimetypesFileTypeMap).getContentType(file)};
	      	}
	      	return {status:404}
      	};};},
      	staticFile: function(path) {return function() {return function() {
      		var file = new File(path);
      		if(bytes = readBytes(file)) {
      			mvc.getBuffer().append(new java.lang.String(bytes));
      			return {status:200,type:(new javax.activation.MimetypesFileTypeMap).getContentType(file)};
	      	}
	      	return {status:404}
      	};};},
			},
      routes = require(appDir+"/conf/routes.js").routes.call(routeEnv,mvc.controllers());


server.createContext("/", function(htex) {
	try {
		var status = 404, type = "text/html";
		mvc.setBuffer(new java.lang.StringBuilder());
		for each(let route in routes) {
			let params = {}, keys = [], [uri,query] = new String(htex.getRequestURI()).split("?");
			if(Object.isglobal(query)) query = "";
			if(!route[0] === "*" && !route[0] === htex.getRequestMethod())
				continue;
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
			if(!Object.isFunction(route[2](params)))
				continue;
			out = route[2](params)(Object.extend(params,query.parseQuery()));
			out = Object.isglobal(out) ? {} : out;
			type = "type" in out ? out.type : type;
			status = "status" in out ? out.status : 200;
			break;
		}
	} catch(e) {
		mvc.getBuffer().append(e);
	} finally {
		htex.getResponseHeaders().add("Content-type",type);
		htex.sendResponseHeaders(status,mvc.getBuffer().length());
		htex.getResponseBody().write(mvc.getBuffer().toString().getBytes());
		htex.close();
	}
});
server.start();
print("Listening on "+addr);