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
	'Object'
].forEach(function(type) {
	Object['is'+type] = function(test) {
		return Object.prototype.toString.call(test) === '[object %s]'.printf(type);
	};
});

var addr = new java.net.InetSocketAddress("localhost", 8000),
    server = HttpServer.create(addr, 10);

exports.buffer = (function(){
	var inner = "";
	return {
		toString: function() inner,
		append: function(a) {
			inner += ""+a;
			return this;
		},
		charAt: function(i) inner[i],
		indexOf: function(s,i) inner.indexOf(s,i),
		insert: function(i,a) {
			inner = inner.substr(0,i)+a+inner.substr(i);
			return this;
		},
		length: function() inner.length
	};
}())
exports.controller = function(actions) {
	spec = {
		"renderJSON": function(args) {
			exports.buffer.append(string)
		}
	};
	for each(let [name,action] in Iterator(actions)) {
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
server.createContext("/", (function(){
	var buf = new BufferedReader(new InputStreamReader(new DataInputStream(new FileInputStream("conf/routes")))),
	routes = [],
	line = "",
	models = exports.fromFiles("app/models"),
	controllers = exports.fromFiles("app/controllers");

	while((line = buf.readLine()) != null) {
		let r = {};
		[r.method,r.url,r.action] = new String(line).split(/\s+/);
		routes.push(r)
	}
	return function(htex) {
		exports.buffer = new java.lang.StringBuilder();
		for each(let route in routes) {
			let params = {}, keys = [];
			if(!route.method === "*" && !route.method === htex.getRequestMethod())
				continue;
			let r = new RegExp(route.url.replace(/\{(\w+)\}/g,function(m,key){
				keys.push(key)
				return "([\\w0-9]+)";
			}));
			new String(htex.getRequestURI()).replace(r,function(m){
				Array.shift(arguments,1).forEach(function(v,k){
					params[keys[k]] = v;
					print(keys[k],v)
				})
			});
		}
		t.sendResponseHeaders(200,exports.buffer.length());
		t.getResponseBody().write(exports.buffer.toString().getBytes());
		os.close();
		t.close();
	}
}()));
server.start();
print("oh hai")