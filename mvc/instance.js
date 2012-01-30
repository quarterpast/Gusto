const util = require("util"),
pathutil = require("path"),
Renderer = require("mvc/renderer.js"),
redirect = require("redirect.js"),
ErrorHandler = require("error.js");

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
			var path = base ? pathutil.join(base,act) : act;
			new Renderer(path,args,base+"."+action,result.params.ajax)
			.on("render",function(output) {
				var headers = {"Content-type":"text/html"};
				if(results.params.ajax) {
					headers.merge({"X-Template-Params":JSON.stringify(args)});
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