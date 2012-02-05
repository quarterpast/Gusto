const util = require("util"),
pathutil = require("path"),
Renderer = require("./renderer.js"),
redirect = require("../server/redirect.js"),
ErrorHandler = require("./error.js");

module.exports = function(result,base,action) {
	if(!("write" in result)) {
		throw new TypeError(util.format("how am I supposed to write with \"%s\"",util.inspect(result)));
	}
	return {
		"redirect": redirect.fill(null,result),
		"renderJSON": function(args) {
			result.writeHead(200,{"Content-type":"application/json"});
			result.end(JSON.stringify(args));
		},
		"render": function(args,other) {
			var act = action;
			if(Object.isString(args)) {
				act = args;
				args = other;
			}
			args = args || {};
			var path = base ? pathutil.join(base,act) : act,
			ajax = "ajax" in result.params;
			new Renderer(path,args,base+"."+action,"",ajax)
			.on("render",function(output) {
				var headers = {"Content-type":"text/html"};
				if(ajax) {
					headers = {
						"X-Template-Params":JSON.stringify(args),
						"Content-type":"text/plain"
					}
				}
				result.writeHead(200,headers);
				result.end(output);
			}).on("error",function(e) {
				console.log(e.template);
				new ErrorHandler(e).on("render",function(output) {
					result.writeHead(501,{"Content-type":"text/html"});
					result.end(output);
				});
			});
		}
	};
};