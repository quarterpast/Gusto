importPackage(java.io);
require("extend.js").extend(Object,String,Array);
XML.ignoreWhitespace = false;
XML.prettyPrinting = false;
var buffer;
exports.fromFiles = function(folder,skip) {
	var files = new File(folder).listFiles()
	                .filter(function(f) f.getName().substr(-3) == ".js"),
	    objects = {};
	for each(let file in files) {
		if(file.getName() === skip) continue;
		let basename = file.getName().substring(0,file.getName().length()-3)
		objects[basename] = require(file.getPath())[basename];
	}
	return objects;
};
exports.init = function(base) {
	if(typeof base != "undefined") {
		var name = new File(base).getName(),
		    base = name.substr(0,name.length()-3);
	}
	return {
		fromFiles: exports.fromFiles,
		models: function(id) exports.fromFiles("app/models",id),
		controllers: function(id) exports.fromFiles("app/controllers",id),
		setBuffer: function(b) buffer = b,
		getBuffer: function() buffer,
		controller: function(actions) {
			var spec = {
				"renderJSON": function(action,args) {
					buffer.append(JSON.stringify(args));
				},
				"render": function(action,args,other) {
					[action,args] = Object.isString(args) ? [args,other] : [action,args];
					args = Object.isUndefined(args) ? {} : args;
					function inner(path,output,extraArgs) {
						extraArgs = Object.isUndefined(extraArgs) ? {} : extraArgs;
						try {
							var template = require("app/views/"+path+".ejs").template,
							    extras = {},
							    output = template.call(Object.extend(args,extraArgs),Object.extend(require("template.js"),{
								    layout:function() output,
								    set: function(k,v){extras[k]=v;return ""},
								    get: function(k) extras[k]
							    }),exports.fromFiles("app/controllers"));
							if(Object.isArray(output)) {
								[extend,output] = output;
								output = inner(extend,output,extras);
							}
						} catch(e) {
							output = <div class="error">{e}</div>;
						}
						return output;
					}
					buffer.append(inner((base ? base+"/" : "")+action,args).toXMLString());
				}
			};
			for each(let [name,action] in Iterator(actions)) {
				let context = {};
				for each(let [k,v] in Iterator(spec)) {
					context[k] = v.bind(context,name);
				}
				spec[name] = action.bind(context);
				spec[name].id = base+"."+name;
			}
			return spec;
		},
		model: function(spec) {
			return {
				create: function(params) {
					var id = new File("data/"+base).listFiles().length,
					    out = {
						save: function() {
							
							var file = FileWriter("data/"+base+"/"+id+".json"),
							    buf = new BufferedWriter(file);
							buf.write(JSON.stringify(this));
							buf.close();
						}
					};
					for each(let [k,v] in Iterator(spec)) {
						var type = v;
						if(!Object.isFunction(type)) {
							if(Object.isArray(type) && Object.isFunction(type[0])) {//TODO: arrays
								type = type[0];
							} else throw new TypeError("Must be a constructor or array constructor");
						}
						out[k] = new type(params[k]);
					}
					return out;
				}
			}
		}
	};
};