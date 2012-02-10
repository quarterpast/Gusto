// router.js
// a filter function. takes a route, returns an action (or nothing)
const url = require("url"),
list = require("../mvc/list.js"),
instance = require("../mvc/instance.js"),
staticRoute = require("./static.js"),
redirect = require("./redirect.js");

module.exports = function Router(req,res,route) {
	var params = {}, keys = [], uri = url.parse(req.url,true);
	if(route[0] === "*" || route[0] == req.method) {
		// method matches
		var reg = new RegExp(
			// build a regexp from the placeholders in the url
			"^"+route[1]
			.replace(
				/\{([\w]+?)(\|[\s\S]+?)?(\/)?\}/g,
				function(m,key,sub,slash){
					keys.push(key);
					if(sub) {// route specifies its own regexp
						return sub.substr(1);
					}
					if(slash == '/') {
						return "((/?[^/?*:;{}\\\\]+)+)";
					}
					return "([\\w0-9.-]+)";
				}
			)+
			"$");

		if(reg.test(uri.pathname)) {
			uri.pathname.replace(reg,function(m){
				// grab variables from the url
				for(var i = 1, l = keys.length; i <= l; ++i) {
					params[keys[i-1]] = arguments[i];
				}
			});
			var env = ({}).merge(list.controllers)
			              .merge(params)
			              .merge({
				              static: staticRoute,
				              redirect: redirect
				            });
			try {
				// evaluate the action id
				action = route[2].runInNewContext(env);
			} catch(e) {
				if(e.name == "TypeError") {
					return;// doesn't exist
				} else throw e;
			}
			if(!action) return null;
			var id = action.id, run, bits = id.split('.');

			if([// give it the right context
				"static.file",
				"static.dir",
				"static.url",
				"static.template",
				"redirect"
			].some(id)) {
				run = action.bind(null,req,res,route[3]);
			} else {
				methods = instance(res,bits[0],bits[1]);
				run = action.bind(action.context.merge(methods));
			}
			run.params = params;
			return run;
		}
	}
};