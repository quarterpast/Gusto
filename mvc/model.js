importPackage(java.io);
const list = require("mvc/list.js");
exports.create = function(spec) {
	if(Object.isString(this)) {
		var name = new File(this).getName(),
		    base = name.substr(0,name.length()-3);
	}
	spec.merge({id:{type:Number}});
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
		} else if(list.isModel(desc.type)) {
			out = desc.type.byId(value);
		} else {
			out = new desc.type(value);
		}
		return out;
	}, make = function(params) {
		var out = methods.clone();
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
			var obj = make(params.merge({id: list.length}));
			list.push(obj);
			for(let [m,func] in Iterator(methods)) {
				Object.defineProperty(obj,m,{value:func.bind(obj)});
			}
			return obj;
		}
	};
	return out;
};