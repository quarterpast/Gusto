const url = require("url"),
static = require("static.js");
module.exports = function(req,route) {
	var params = {}, keys = [], uri = url.parse(req.url,true), action;
	if(route[0] === "*" || route[0] == req.method) {
		var reg = new RegExp("^"+route[1].replace(/\{([\w]+?)\}/g,function(m,key){
			keys.push(key)
			return "([\\w0-9\.\-]+)";
			})+"$");
		if(reg.test(uri.pathname)) {
			uri.replace(reg,function(m){
				Array.slice(arguments,1,keys.length+1).forEach(function(v,k){
					params[keys[k]] = v;
				})
			});
			//var action = route[2].runInNewContext()
			if([static.file,static.dir].some(route[2])) {
				action = route[2].bind(null,route[3]);
			} else if(meta.isAction(route[2])) {
				action = route[2];
			} else if(typeof route[2] === "string") {

			} else {
				action = route[2](params);
			}
			return true;
		}
	}
	return false;
};