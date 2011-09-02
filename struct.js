importPackage(Packages.com.sun.net.httpserver);
importPackage(java.io);

String.prototype.toNumber = function() {
	return parseFloat(this);
};
String.prototype.toInteger = function(radix) {
	return parseInt(this,radix);
};
String.prototype.printf = function() {
	var string = this, args = arguments, index = 0;
	for(let [code,func] in Iterator({
		'%': function() '%',
		's': function(arg) arg.toString(),
		'd': function(arg) arg.toInteger(10),
		'f': function(arg) arg.toNumber()
	})) {
		string = string.replace('%'+code,function(m) {
			return func(args[index++]);
		},'g');
	}
	return string;
};
[
	'String',
	'Number',
	'Undefined',
	'Function',
	'Array',
	'Object',
	'Arguments'
].forEach(function(type) {
	Object['is'+type] = function(test) {
		return Object.prototype.toString.call(test) === '[object %s]'.printf(type);
	};
});

var addr = new java.net.InetSocketAddress("localhost", 8000),
    server = HttpServer.create(addr, 10),
    controllerFiles = new File("app/controllers").listFiles()
                          .filter(function(f) f.getName().substr(-3) == ".js"),
    modelFiles      = new File("app/models").listFiles()
                          .filter(function(f) f.getName().substr(-3) == ".js"),
    controllers = [],
    models = [];
exports.controller = function(actions) {
	print("controller")
	var spec = {
		"render": function(args) {
			print(this.render.caller)
		}
	};
	for each(let [name,action] in Iterator(actions)) {
		print(action)
		spec[name] = function() {
			action.apply(spec,arguments);
		}
	}
	return spec;
};
exports.model = function(spec) {
	return {
		create: function(params) {
			for each(let [k,v] in Iterator(spec)) {
				var type = v;
				if(!Object.isFunction(type)) {
					if(Object.isArray(type) && Object.isFunction(type[0])) {
						type = type[0];
					} else throw new TypeError("Must be a constructor or array constructor");
				}
				this[k] = new type(params[k]);
			}
			return this;
		}
	};
};
exports.models = function(id) {
	var models = [];
	for each(let file in modelFiles) {
		if(file.getName() == id) continue;
		let basename = file.getName().split(".").slice(0,-1).join(".")
		models[basename] = require(file.getPath())[basename];
	}
	return models;
};
exports.controllers = function(id) {
	print(id)
	var controllers = [];
	for each(let file in controllerFiles) {
		if(file.getName() == id) continue;
		let basename = file.getName().split(".").slice(0,-1).join(".")
		controllers[basename] = require(file.getPath())[basename];
	}
	return controllers;
};
models = exports.models();
controllers = exports.controllers();
server.createContext("/",  function(t){
	print(controllers)
	t.sendResponseHeaders(200,bytes.length);
	t.getResponseBody().write(bytes);
	os.close();
	t.close();
});
print("oh hai")
server.start();