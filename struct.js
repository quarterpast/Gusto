importPackage(Packages.com.sun.net.httpserver);
importPackage(java.io);
[
	'String',
	'Number',
	'Undefined',
	'Function',
	'Array',
	'Object',
	"global"
].forEach(function(type) {
	Object['is'+type] = function(test) {
		return Object.prototype.toString.call(test) === '[object '+type+']';
	};
});
String.prototype.parseQuery = function() {
	if(this == "") return {};
	var parts = this.split("&"), out = {};
	for each(let part in parts) {
		let comp = part.split("="),
		    k = comp.shift().replace(/\[\]$/,""),
		    v = decodeURIComponent(comp.join("=").replace("+"," "));
		if(v == '') v = true;
		if(k in out) {
			if(Object.isArray(out[k])) {
				out[k].push(v);
			} else {
				out[k] = [out[k],v];
			}
		} else {
			out[k] = v;
		}
	}
	return out;
};
Object.defineProperty(Array.prototype,"_", {value:function() this.reduce(function(a,n) a += n,<></>)});
Object.extend = function(d,s,m) {
	for(let p in s) {
		if(s.hasOwnProperty(p)) {
			d[p] = s[p];
		}
	}
	return d;
};
Object.unbox = function(obj) {
	Object.extend((function() this).call(null),obj,true);
};
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
			exports.buffer.append(JSON.stringify(args));
		},
		"render": function(action,args) {
			print(arguments.callee.caller)
			//[action,args] = Object.isString(action) ? [action,args] : ["undefined",action];

		}
	};
	for each(let [name,action] in Iterator(actions)) {
		let context = spec;
		for each(let [k,v] in Iterator(context)) {
			v.bind(context,name);
		}
		spec[name] = action.bind(context);
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
	var models = exports.fromFiles("app/models"),
	controllers = exports.fromFiles("app/controllers"),
	routes = require("conf/routes.js").routes(controllers),
	action = null;
	return function(htex) {
		try {
		exports.buffer = new java.lang.StringBuilder();
		for each(let route in routes) {
			let params = {}, keys = [], [uri,query] = new String(htex.getRequestURI()).split("?");
			if(Object.isglobal(query)) query = "";
			if(!route[0] === "*" && !route[0] === htex.getRequestMethod())
				continue;
			let reg = new RegExp("^"+route[1].replace(/\{(\w+)\}/g,function(m,key){
				keys.push(key)
				return "([\\w0-9]+)";
			})+"$");
			if(!reg.test(uri))
				continue;
			uri.replace(reg,function(m){
				Array.slice(arguments,1,keys.length+1).forEach(function(v,k){
					params[keys[k]] = v;
				})
			});
			if(!Object.isFunction(route[2](params)))
				continue;
			route[2](params)(Object.extend(params,query.parseQuery()));
			break;
		}
		htex.sendResponseHeaders(200,exports.buffer.length());
		htex.getResponseBody().write(exports.buffer.toString().getBytes());
		htex.close();
		} catch(e) {print(e)}
	}
}()));
server.start();
print("oh hai")