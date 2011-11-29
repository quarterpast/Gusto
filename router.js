const buffer = require("mvc/buffer.js"),
staticroute = require("staticroute.js");
exports.router = function(htex) {
	try {
		var status = 404, type = "text/html",binary=false;
		buffer.buffer.set(new java.lang.StringBuilder());
		for each(let route in routes) {
			let params = {}, keys = [], [uri,query] = new String(htex.getRequestURI()).split("?"), action;
			if(Object.isglobal(query)) query = "";
			if(route[0] === "*" || route[0] == htex.getRequestMethod()) {
				let reg = new RegExp("^"+route[1].replace(/\{([\w]+?)\}/g,function(m,key){
					keys.push(key)
					return "([\\w0-9\.\-]+)";
				})+"$");
				if(reg.test(uri)) {
					uri.replace(reg,function(m){
						Array.slice(arguments,1,keys.length+1).forEach(function(v,k){
							params[keys[k]] = v;
						})
					});

					if([staticroute.staticFile,staticroute.staticDir].some(route[2]))
						action = route[2](route[3]);
					else if(meta.isAction(route[2]))
						action = route[2];
					else
						action = route[2](params);

					if(htex.getRequestMethod() == "POST") {
						let stream = htex.getRequestBody(),
						    buf = new java.lang.StringBuilder(),
						    read = -1,
						    bytes;
						do {
							bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, stream.available());
							read = stream.read(bytes);
							buf.append(new java.lang.String(bytes));
						} while(read != -1);
						stream.close();
						query += "&"+buf.toString();
					}
					out = action(params.merge(Object.fromQueryString(query)));
					out = Object.isglobal(out) ? {} : out;
					type = "type" in out ? out.type : type;
					status = "status" in out ? out.status : 200;
					binary = "binary" in out ? out.binary : false;

					print(htex.getRequestMethod(),uri,status,type,binary?"binary":"text")
					break;
				}
			}
		}
	} catch(e) {
		print(e.fileName);
		buffer.buffer.get().append(e);
	} finally {
		htex.getResponseHeaders().add("Content-type",type);
		if(binary) {
			htex.sendResponseHeaders(status,buffer.bytes.get().length);
			htex.getResponseBody().write(buffer.bytes.get());
		} else {
			htex.sendResponseHeaders(status,0);
			htex.getResponseBody().write(buffer.buffer.get().toString().bytes.get());
		}
		htex.close();
	}
};
