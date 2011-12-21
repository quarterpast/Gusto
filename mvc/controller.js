const fs = require("fs"),
pathutil = require("path"),
Renderer = require("mvc/renderer.js"),
tmpl = require("tmpl");

module.exports = function(actions) {
	if(Object.isString(this)) {
		var base = pathutil.basename(this,".js");
	}
	var spec = {
		"redirect": function(path) {
			return {status:302,headers:{"Location":path}};
		},
		"renderJSON": function(action,args) {
			if(!("write" in this)) {
				throw new TypeError(util.format("how am I supposed to write with \"%s\"",util.inspect(this)));
			}
			this.write(JSON.stringify(args));
		},
		"render": function(action,args,other) {
			if(!("write" in this)) {
				throw new TypeError(util.format("how am I supposed to write with \"%s\"",util.inspect(this)));
			}
			if(Object.isString(args)) {
				action = args;
				args = other;
			}
			args = args || {};
			var path = base ? pathutil.join(base,action) : action,
			    that = this;
			new Renderer(path,args).on("render",function(output) {
				that.write(output);
			});
		}
	};
	actions.each(function(name,action) {
		var context = {};
		spec.each(function(k,v) {
			context[k] = v.bind(context,name);
		});
		action.context = context;
		actions[name] = action.bind(action.context);
		actions[name].inner = action;
		actions[name].id = base+"."+name;
	}).each(function(name,action) {
		actions[name].inner.context = action.inner.context.merge(actions);
	});


	return spec.merge(actions);
}