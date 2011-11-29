importPackage(java.io);
const list = require("mvc/list.js"),
staticroute = require("staticroute.js"),
config = require("config.js").config,
routes = require(config.appDir+"/conf/routes.js").routes.call(staticroute,list.controllers());
exports.route = function(action,method) {
	var id = Object.isFunction(action) ? action.id : action,
	    $continue = "£$%continue, motherfucker";
	for each(let route in routes) {
		if(!Object.isglobal(method) && route[0] != "*" && method != route[0]) continue;
		if(staticroute.staticFile === route[2]) {
			if(route[3] !== id) continue;
			if(!(new File(id)).exists()) continue;
			return route[1];
		} else if(staticroute.staticDir === route[2]) {
			if(new File(id).getParent() != route[3]) continue;
			return route[1].replace('{file}',new File(id).getName())
		} else if(list.isAction(route[2])) {
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
