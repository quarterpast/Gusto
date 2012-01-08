const util = require("util"),
pathutil = require("path"),
Renderer = require("mvc/renderer.js");

module.exports = function(result,base,action) {
	if(!("write" in result)) {
		throw new TypeError(util.format("how am I supposed to write with \"%s\"",util.inspect(result)));
	}
	return {
		"redirect": function(path) {
			return {status:302,headers:{"Location":path}};
		},
		"renderJSON": function(args) {
			result.emit("queue",[result.write,JSON.stringify(args)]);
			result.emit("done",200,{"Content-type":"application/json"});
		},
		"render": function(args,other) {
			if(Object.isString(args)) {
				action = args;
				args = other;
			}
			args = args || {};
			var path = base ? pathutil.join(base,action) : action;
			new Renderer(path,args).on("render",function(output) {
				result.emit("queue",[result.write,output]);
				result.emit("done",200,{"Content-type":"text/html"});
			});
		}
	};
};