const list = require("mvc/list.js"),
tmpl = require("tmpl.js");
module.exports = function(actions) {
	if(Object.isString(this)) {
		var name = new File(this).getName(),
		    base = name.substr(0,name.length()-3);
	}
	var spec = {
		"redirect": function(path) {
			return {status:302,headers:{"Location":path}}
		},
		"renderJSON": function(action,args) {
			exports.buffer.get().append(JSON.stringify(args));
		},
		"render": function(write,action,args,other) {
			if(!Object.isFunction(writer)) throw new TypeError(util.format("how am I supposed to write with \"%s\"",util.inspect(write))
			if(Object.isString(args)) {
				action = args;
				args = other;
			}
			args = args || {};

			var path = (base ? base+"/" : "")+action,
			    oldpath = '',
			    output,
			    extras = {};
			do {
				oldpath = path;
				try {
					//@TODO: async file reading
					var str = readFile(path.join("app/views/",path+".ejs")),
					    template = tmpl.compile(str);
					output = template.call(args.merge(extras),template.merge({
							extend: function(daddy) {path = daddy},
							layout:function() output,
							set: function(k,v){extras[k]=v;},
							get: function(k) extras[k],
							exists: function(k) k in extras
						}
					),list.controllers);
				} catch(e) {
					if(output = tmpl.handle(e)) {
						path = "error";
					} else {
						throw e;
					}
				}
			} while(path !== oldpath);
			write(output);
		}
	};
	for each(let [name,action] in Iterator(actions)) {
		let context = {};
		for each(let [k,v] in Iterator(spec)) {
			context[k] = v.bind(context,name);
		}
		action.context = context;
		actions[name] = action.bind(action.context);
		actions[name].inner = action;
		actions[name].id = base+"."+name;
	}
	for each(let [name,action] in Iterator(actions)) {
		actions[name].inner.context = action.inner.context.merge(actions);
	}


	return spec.merge(actions);
}