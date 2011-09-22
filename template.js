const router = require("router.js");
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
	    routes = require(environment['user.dir']+"/conf/routes.js").routes.call(router,mvc.controllers());
	for each(let route in routes) {
		if(router.staticFile === route[2]) {
			//print("file",route.toSource())
		}
		if(router.staticDir === route[2]) {
		//	print("dir",route)
		}
		//print(route[2].toSource());
	}
	print(mvc.controllers().posts.index)
	return action.id
};
exports.include = function(template,args) {
	var template = require("app/views/"+template+".ejs").template;
	return template.call(args,exports).toXMLString();
};