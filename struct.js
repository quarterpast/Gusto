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
Object.extend = function(d,s,m) {
	for(let p in s) {
		if(s.hasOwnProperty(p) && m && !(p in d)) {
			d[p] = s[p];
		}
	}
	return d;
}
Object.unbox = function(obj) {
	Object.extend((function() this).call(null),obj,true);
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
	var routes = require("conf/routes.js")
	models = exports.fromFiles("app/models"),
	controllers = exports.fromFiles("app/controllers"),
	action = null;
	return function(htex) {
		exports.buffer = new java.lang.StringBuilder();
		for each(let route in routes) {
			let params = {}, keys = [], uri = new String(htex.getRequestURI());
			if(!route[0] === "*" && !route[0] === htex.getRequestMethod())
				continue;
			let reg = new RegExp(route[1].replace(/\{(\w+)\}/g,function(m,key){
				keys.push(key)
				return "([\\w0-9]+)";
			}));
			if(!uri.match(reg))
				continue;
			uri.replace(reg,function(m){
				Array.slice(arguments,1,keys.length+1).forEach(function(v,k){
					params[keys[k]] = v;
				})
			});
			action = route[2].call({},params);
			action.call({},Object.extend(params,{/* GET DATA FROM SOMEWHERE*/}))
		}
		t.sendResponseHeaders(200,exports.buffer.length());
		t.getResponseBody().write(exports.buffer.toString().getBytes());
		os.close();
		t.close();
	}
}()));
server.start();
print("oh hai")