// template.js
// additional utility functions for the templates to use
const list = require("../mvc/list.js"),
static = require("../server/static.js"),
config = require("../main.js"),
fs = require("fs"),
path = require("path"),
querystring = require("querystring"),
data = fs.readFileSync(// grab routes from the file
	path.join(config.appDir,"conf","routes.conf")
).toString(),

routes = data.split(/[\n\r]/).map(function(line) {
	// filter the routes into a lovely array
	var parts = line.split(/\s+/);
	if(!["*","HEAD","GET","POST","PUT","TRACE","DELETE","OPTIONS","PATCH"].some(parts[0]))
		throw new SyntaxError("Invalid HTTP method "+parts[0]);
	return parts;
});

// reverse router. takes an action (or id) and
// spits out an url that will route to it
exports.route = function(action,method,params) {
	var id = Object.isFunction(action) ? action.id : action,
	query = querystring.stringify(params),
	filter = routes.map(function(route) {
		// match the http method
		if(!!method && route[0] != "*" && method != route[0]) return;

		if("static.file" === route[2]) {
			if(route[3] !== id) return;
			if(!path.existsSync(id)) return;
			return route[1];
		}

		if("static.dir" === route[2]) {
			if(path.dirname(id) != route[3]) return;
			return route[1].replace('{file/}',path.basename(id));
		}

		if("static.url" === route[2]) {
			return; //@TODO: actually give the url back
		}

		if("redirect" === route[2]) {
			return; //@TODO: actually reverse redirect
		}
		if(list.isAction(route[2])) {
			if(route[2] !== id) return;
			return route[1];
		}
		// if we've got this far, it's a variable route
		// so let's parse it into something we can use
		// [a-z\$_][a-z0-9\$_]* matches a JavaScript identifier
		// (this might get replaced with an actual parser,
		// currently it only matches things like this[a][b])
		var base = "", keys = route[2].replace(
			/^([a-z\$_][a-z0-9\$_]*)\[|\]$/gi,function(m,b){
			if(m !== ']' && b != "this") base = b;
			return "";
		}).split("]["),
		reg = new RegExp("^"+(
			base && base+"\\."
		)+keys.map(function() {
			return "([\\$_a-zA-Z][\\$_0-9a-zA-Z]*)";
		}).join("\\.")+"$"),
		uri = route[1];

		if(!reg.test(id)) return;
		id.replace(reg,function(m) {// put the vars in the uri
			var args = Array.create(arguments);
			args.each(function(arg,i) {
				uri = uri.replace('{'+keys[i-1]+'}',arg);
			},1);
		});
		return uri;
	}).compact();// remove any undefined/null/empty entries
	if(filter.length) {
		// we have at least one match, return the best
		return filter[0]+(query && '?'+query);
	}
	throw new SyntaxError("Could not route "+id);
};