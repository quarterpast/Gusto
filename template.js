const list = require("mvc/list.js"),
fs = require("fs"),
path = require("path"),
static = require("static.js"),
config = require.main.exports.config,
data = fs.readFileSync(path.join(config.appDir,"conf","routes.conf")).toString(),
routes = data.split(/[\n\r]/).map(function(line) {
	var parts = line.split(/\s+/);
	if(!["*","HEAD","GET","POST","PUT","TRACE","DELETE","OPTIONS","PATCH"].some(parts[0]))
		throw new SyntaxError("Invalid HTTP method "+parts[0]);
	return parts;
});
exports.route = function(action,method) {
	var id = Object.isFunction(action) ? action.id : action,
	filter = routes.map(function(route) {
		if(!!method && route[0] != "*" && method != route[0]) return null;

		if("static.file" === route[2]) {
			if(route[3] !== id) return null;
			if(!path.existsSync(id)) return null;
			return route[1];
		}

		if("static.dir" === route[2]) {
			if(path.dirname(id) != route[3]) return null;
			return route[1].replace('{file}',path.basename(id));
		}

		if(list.isAction(route[2])) {
			if(route[2] !== id) return null;
			return route[1];
		}

		var keys = route[2].replace(/^this\[|\]$/g,'').split("]["),
		reg = new RegExp("^"+keys.map(function() {
			return "([\\$_a-zA-Z][\\$_0-9a-zA-Z]*)";
		}).join("\\.")+"$"),
		uri = route[1];

		if(!reg.test(id)) return null;

		id.replace(reg,function(m) {
			var args = Array.create(arguments);
			args.each(function(arg,i) {
				uri = uri.replace('{'+keys[i-1]+'}',arg);
			},1);
		});
		return uri;
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
