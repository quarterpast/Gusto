importPackage(java.io);
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
	var mvc = require("mvc.js"),
	    router = require("router.js"),
	    routes = require(environment['user.dir']+"/conf/routes.js").routes.call(router,mvc.init().controllers()),
	    id = Object.isFunction(action) ? action.id : action,
	    $continue = "£$%continue, motherfucker";

	for each(let route in routes) {
		if(router.staticFile === route[2]) {
			if(route[3] !== id) continue;
			if(!(new File(id)).exists()) continue;
			return route[1];
		} else if(router.staticDir === route[2]) {
			if(new File(id).getParent() != route[3]) continue;
			return route[1].replace('{file}',new File(id).getName())
		} else if(mvc.isAction(route[2])) {
			if(route[2].id !== id) continue;
			return route[1];
			
		} else {
			let keys = [],
			    out = route[2].toSource().replace(/\(function \((_?)\) \$\.?([\s\S]+);\)/,function(m,under,body) {
				if(under === '_') {
					let uri = route[1],
					    reg = new RegExp("^"+body.replace(/\]\[/g,'£').replace(/^\[|\]$/g,'').replace(/_\.([\w]+)(£?)/g,function(m,key,dot){
						keys.push(key)
						return "([\\w0-9\.]+)"+(dot === '£' ? '\\.' : '');
					})+"$");
					if(!reg.test(id))
						return $continue;
					id.replace(reg,function(m){
						Array.slice(arguments,1,keys.length+1).forEach(function(v,k){
							uri = uri.replace('{'+keys[k]+'}',v);
						})
					});
					return uri;
				} else if(body === id) {
					return route[1];
				}
			});
			if(out === $continue || out === "undefined") continue;// no, those quotes *are* meant to be there
			return out;
		}
	}
	throw "routing error"
};
exports.include = function(template,args) {
	var template = require("app/views/"+template+".ejs").template;
	return template.call(args,exports).toXMLString();
};