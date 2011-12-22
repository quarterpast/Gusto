module.exports = function(result,base,action) {
	return {
		"redirect": function(path) {
			return {status:302,headers:{"Location":path}};
		},
		"renderJSON": function(args) {
			if(!("write" in this)) {
				throw new TypeError(util.format("how am I supposed to write with \"%s\"",util.inspect(this)));
			}
			result.write(JSON.stringify(args));
		},
		"render": function(args,other) {
			if(!("write" in this)) {
				throw new TypeError(util.format("how am I supposed to write with \"%s\"",util.inspect(this)));
			}
			if(Object.isString(args)) {
				action = args;
				args = other;
			}
			args = args || {};
			var path = base ? pathutil.join(base,action) : action;
			new Renderer(path,args).on("render",function(output) {
				result.write(output);
			});
		}
	};
}