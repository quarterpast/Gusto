const buffer = require("mvc/buffer.js"),
staticroute = require("staticroute.js"),
url = require("url"),
querystring = require("querystring");
module.exports = function(req,res) {
	var status = 404,
	    type = "text/html",
	    binary=false;
	
	buffer.buffer.set(new java.lang.StringBuilder());
	
	routes.each(function(route) {
		var params = {}, keys = [], uri = url.parse(req.url,true), action;
		if(route[0] === "*" || route[0] == htex.getRequestMethod()) {
			var reg = new RegExp("^"+route[1].replace(/\{([\w]+?)\}/g,function(m,key){
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

				if(req.method == "POST") {
					var 
					req.on("data",function(chunk) {
						
					});
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
	htex.getResponseHeaders().add("Content-type",type);
	if(binary) {
		htex.sendResponseHeaders(status,buffer.bytes.get().length);
		htex.getResponseBody().write(buffer.bytes.get());
	} else {
		htex.sendResponseHeaders(status,0);
		htex.getResponseBody().write(buffer.buffer.get().toString().bytes.get());
	}
	htex.close();
};
