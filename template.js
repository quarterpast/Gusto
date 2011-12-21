const list = require("mvc/list.js"),
fs = require("fs"),
path = require("path"),
static = require("static.js"),
config = require.main.exports.config,
data = fs.readFileSync(path.join(config.appDir,"conf","routes.conf")).toString(),
routes = data.split(/[\n\r]/).each(function(line) {
	var parts = line.split(/\s+/);
	if(!["*","HEAD","GET","POST","PUT","TRACE","DELETE","OPTIONS","PATCH"].some(parts[0]))
		throw new SyntaxError("Invalid HTTP method "+parts[0]);
	return parts;
});
path = require("path");
exports.route = function(action,method) {
	var id = Object.isFunction(action) ? action.id : action,
	    $continue = "£$%continue, motherfucker",
	filter = routes.map(function(route) {
		if(!Object.isglobal(method) && route[0] != "*" && method != route[0]) return null;
		if("static.file" === route[2]) {
			if(route[3] !== id) return null;
			if(!path.existsSync(id)) return null;
			return route[1];
		} else if("static.dir" === route[2]) {
			if(path.dirname(id) != route[3]) return null;
			return route[1].replace('{file}',path.basename(id));
		} else if(list.isAction(route[2])) {
			if(route[2] !== id) return null;
			return route[1];
			
		} else {
			var keys = [],//@TODO: for new routes fmt
			    out = route[2].toSource().replace(/\(function \((_?)\) \$\.?([\s\S]+);\)/,function(m,under,body) {
				if(under === '_') {
					var uri = route[1],
					    reg = new RegExp("^"+body.replace(/\]\[/g,'£').replace(/^\[|\]$/g,'').replace(/_\.([\w]+)(£?)/g,function(m,key,dot){
						keys.push(key)
						return "([\\w0-9\.]+)"+(dot === '£' ? '\\.' : '');
					})+"$");
					if(!reg.test(id))
						return $continue;
					id.replace(reg,function(m){
						Array.slice(arguments,1,keys.length+1).each(function(v,k){
							uri = uri.replace('{'+keys[k]+'}',v);
						})
					});
					return uri;
				} else if(body === id) {
					return route[1];
				}
			});
			if(out === $continue || out === "undefined") return null;// no, those quotes *are* meant to be there
			return out;
		}
	}).compact();
	if(filter.length) {
		return filter[0];
	}
	throw new SyntaxError("Could not route "+id);
};
exports.include = function(template,args) {
	var template = require("app/views/"+template+".ejs").template;
	return template.call(args,exports).toXMLString();
};
