importPackage(java.io);
require("extend.js").extend(Object,String,Array,Boolean,JSON);
const Tmpl = require("tmpl.js");
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
exports.isController = function(m) exports.fromFiles("app/controllers").indexOf(m) !== -1;
exports.isAction = function(m) Object.isFunction(m) && "id" in m;
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
				"redirect": function(path) {
					return {status:302,headers:{"Location":path}}
				},
				"renderJSON": function(action,args) {
					buffer.append(JSON.stringify(args));
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
							    template = Tmpl.compile(str);
							output = template.call(Object.extend(args,extras),Object.extend(
								require("template.js"),
								{
									extend: function(daddy) {path = daddy},
									layout:function() output,
									set: function(k,v){extras[k]=v;},
									get: function(k) extras[k],
									exists: function(k) k in extras
								}
							),exports.fromFiles("app/controllers"));
						} catch(e) {
							if(output = Tmpl.handle(e)) {
								path = "error";
							} else {
								throw e;
							}
						}
					} while(path !== oldpath);
					buffer.append(output.toXMLString ?
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
			}, type = function type(desc,value) {
				var out;
				if(desc.type === Array) {
					out = [];
					for each(let [i,v] in value) {
						out[i] = type({type:desc.elements},v);
					}
				} else if(desc.type === "yo bitches I'm an enum") {
					if(desc.elements.indexOf(value) !== -1) {
						out = value;
					} else if(value in desc.elements) {
						out = desc.elements[value];
					} else {
						throw new TypeError("u mad?")
					}
				} else if(exports.isModel(desc.type)) {
					out = desc.type.byId(value);
				} else {
					out = new desc.type(value);
				}
				return out;
			}, make = function(params) {
				var out = Object.extend({},methods);
				for each(let [k,desc] in Iterator(spec)) {
					out[k] = type(desc,params[k]);
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
					var out = make(Object.extend(params,{id: list.length}));
					list.push(out);
					for(let [m,func] in Iterator(methods)) {
						Object.defineProperty(out,m,{value:func.bind(out)});
					}
					return out;
				}
			};
			return out;
		}
	};
};