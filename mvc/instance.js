const util = require("util"),
pathutil = require("path"),
Renderer = require("mvc/renderer.js");

module.exports = function(result,base,action) {
	return {
		"redirect": function(path) {
			return {status:302,headers:{"Location":path}};
		},
		"renderJSON": function(args) {
			if(!("write" in result)) {
				throw new TypeError(util.format("how am I supposed to write with \"%s\"",util.inspect(result)));
			}
			result.write(JSON.stringify(args));
			result.emit("done",200,{"Content-type":"application/json"});
		},
		"render": function(args,other) {
			if(!("write" in result)) {
				throw new TypeError(util.format("how am I supposed to write with \"%s\"",util.inspect(result)));
			}
			if(Object.isString(args)) {
				action = args;
				args = other;
			}
			args = args || {};
			var path = base ? pathutil.join(base,action) : action;
			new Renderer(path,args).on("render",function(output) {
				result.write(output);
				result.emit("done",200,{"Content-type":"text/html"});
			});
		}
	};
}