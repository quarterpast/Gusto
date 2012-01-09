const util = require("util"),
pathutil = require("path"),
Renderer = require("mvc/renderer.js"),
ErrorHandler = require("error.js");

module.exports = function(result,base,action) {
	if(!("write" in result)) {
		throw new TypeError(util.format("how am I supposed to write with \"%s\"",util.inspect(result)));
	}
	return {
		"redirect": function(path) {
			return {status:302,headers:{"Location":path}};
		},
		"renderJSON": function(args) {
			result.emit("queue",["write",JSON.stringify(args)]);
			result.emit("done",200,{"Content-type":"application/json"});
		},
		"render": function(args,other) {
			var act = action;
			if(Object.isString(args)) {
				act = args;
				args = other;
			}
			args = args || {};
			var path = base ? pathutil.join(base,action) : action;
			new Renderer(path,args).on("render",function(output) {
				result.emit("queue",["write",output]);
				result.emit("done",200,{"Content-type":"text/html"});
			}).on("error",function(e) {
				console.log(e.template);
				new ErrorHandler(e).on("render",function(output) {
					result.emit("queue",["write",output]);
					result.emit("done",501,{"Content-type":"text/html"});
				});
			});
		}
	};
};