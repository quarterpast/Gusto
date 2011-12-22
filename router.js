const url = require("url"),
list = require("mvc/list.js"),
static = require("static.js");
module.exports = function(req,route) {
	var params = {}, keys = [], uri = url.parse(req.url,true), action;
	if(route[0] === "*" || route[0] == req.method) {
		var reg = new RegExp("^"+route[1].replace(/\{([\w]+?)\}/g,function(m,key){
			keys.push(key)
			return "([\\w0-9\.\-]+)";
			})+"$");
		if(reg.test(uri.pathname)) {
			uri.pathname.replace(reg,function(m){
				for(var i = 1, l = keys.length; i <= l; ++i) {
					params[keys[i-1]] = arguments[i];
				}
			});
			var action = route[2].runInNewContext(
				list.controllers.merge(params)
				.merge({
					static: static
				})
			)
			if([static.file,static.dir].some(action)) {
				route.action = action.bind(null,route[3]);
			} else if(list.isAction(route[2])) {
				route.action = action;
			} else {
				route.action = action(params);
			}
			return route;
		}
	}
};