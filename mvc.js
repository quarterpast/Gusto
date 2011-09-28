importPackage(java.io);
require("extend.js").extend(Object,String,Array);
XML.ignoreWhitespace = false;
XML.prettyPrinting = false;
XML.ignoreComments = false;
var buffer,bytes;
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
		isModel: function(m) exports.fromFiles("app/models").indexOf(m) !== -1,
		setBuffer: function(b) buffer = b,
		getBuffer: function() buffer,
		setBytes: function(b) bytes = b,
		getBytes: function() bytes,
		controller: function(actions) {
			if(Object.isFunction(actions)) {
				actions = actions(exports.fromFiles("app/models")[base.substr(0,base.length-1)]);
			}
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
			Object.extend(spec,{id:{type:Number}});
			var dir = (function(f)[f.mkdirs(),f][1])(new File("data/"+base)),
			methods = {
				save: function() {
					var file = FileWriter("data/"+base+"/"+this.id+".json"),
					    buf = new BufferedWriter(file);
					list[this.id] = this;
					buf.write(JSON.stringify(this));
					buf.close();
				}
			}, make = function(params) {
				var out = Object.extend({},methods);
				for each(let [k,desc] in Iterator(spec)) {
					if(desc.type === Array) {
						for each(let [i,v] in params[k]) {
							out[k][i] = new desc.elements(v);
						}
					} else {
						out[k] = new desc.type(params[k]);
					}
				}
				return out;
			},
			list = (dir.listFiles() || []).map(function(file,i,list) {
				return make(JSON.parse(readFile(file)));
			}),
			out = {
				fetch: function(f) list.filter(f),
				create: function(params) {
					var out = Object.extend(make(params),{id: list.length});
					list.push(out)
					return out;
				}
			};
			return out;
		}
	};
};