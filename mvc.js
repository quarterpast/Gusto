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
exports.isModel = function(m) exports.fromFiles("app/models").indexOf(m) !== -1;
exports.init = function(base) {
	if(typeof base != "undefined") {
		var name = new File(base).getName(),
		    base = name.substr(0,name.length()-3);
	}
	return {
		fromFiles: exports.fromFiles,
		enum: "yo bitches I'm an enum",
		models: function(id) exports.fromFiles("app/models",id),
		yes: function() true,
		no: function() false,
		controllers: function(id) exports.fromFiles("app/controllers",id),
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
					args = Object.isglobal(args) ? {} : args;

					var path = (base ? base+"/" : "")+action,
					    output,
					    extras = {test:"hello"};
					do {
						if(Object.isArray(output)) {
							[path,output] = output;
						}
						try {
							let template = require("app/views/"+path+".ejs").template;
							output = template.call(Object.extend(args,extras),Object.extend(
								require("template.js"),
								{
									layout:function() output,
									set: function(k,v){extras[k]=v;return ""},
									get: function(k) extras[k]
								}
							),exports.fromFiles("app/controllers"));
						} catch(e) {
							output = <div class="error">{e}</div>;
						}
					} while(Object.isArray(output));
					buffer.append(output.toXMLString());
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
					} else if(desc.type === "yo bitches I'm an enum") {
						if(desc.elements.indexOf(v) !== -1) {
							out[k][i] = v;
						} else if(v in desc.elements) {
							out[k][i] = desc.elements[v];
						} else {
							throw new TypeError("u mad?")
						}
					} else if(exports.isModel(desc.type)) {
						out[k] = desc.type.byId[params[k]];
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
				byId: function(id) list[id],
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