const list = require("list.js");
exports.create = function(actions) {
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
		"render": function(action,args,other) {
			[action,args] = Object.isString(args) ? [args,other] : [action,args];
			args = Object.isglobal(args) ? {} : args;

			var path = (base ? base+"/" : "")+action,
			    oldpath = '',
			    output,
			    extras = {};
			do {
				oldpath = path;
				try {
					var str = readFile("app/views/"+path+".ejs"),
					    template = tmpl.compile(str);
					output = template.call(Object.extend(args,extras),Object.extend(template, {
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
			exports.buffer.get().append(output.toXMLString ?
				output.toXMLString():
				output.toString()
			);
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
		actions[name].inner.context = Object.extend(action.inner.context,actions);
	}


	return Object.extend(spec,actions);
}