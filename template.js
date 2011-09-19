exports.if = function _if (cond, h, _else) {// cheers, MDC
	if (cond && cond != undefined) { // We need undefined condition for E4X
		return h(cond);
	}
	else if (_else) {
		return _else(cond);
	}
	return ''; // Empty string allows conditions in attribute as well as element content
};
exports.node = function(name,attr,cont) {// in Rhino 1.7R3, you can't embed XML in XML
	var out = <><{name}/></>;
	for(let [k,v] in Iterator(attr)) {
		out.@[k] = v;
	}
	out[name][0] = cont;
	return out[name];
};
exports.route = function(action) {
	var mvc = require("mvc.js").init(),
	    router = require("router.js"),
	    routes = require(appDir+"/conf/routes.js").routes.call(router,mvc.controllers());
	for each(let route in routes) {
		let params = {}, keys = [], [uri,query] = new String(htex.getRequestURI()).split("?");
		if(Object.isglobal(query)) query = "";
		if(!route[0] === "*" && !route[0] === htex.getRequestMethod())
			continue;
		let reg = new RegExp("^"+route[1].replace(/\{([\w]+?)\}/g,function(m,key){
			keys.push(key)
			return "([\\w0-9\.]+)";
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
		out = route[2](params)(Object.extend(params,query.parseQuery()));
		out = Object.isglobal(out) ? {} : out;
		type = "type" in out ? out.type : type;
		status = "status" in out ? out.status : 200;
		break;
	}
};
exports.include = function(template,args) {
	var template = require("app/views/"+template+".ejs").template;
	return template.call(args,exports).toXMLString();
};