const url = require("url"),
list = require("mvc/list.js"),
instance = require("mvc/instance.js"),
staticRoute = require("static.js");
module.exports = function Router(req,res,route) {
	var params = {}, keys = [], uri = url.parse(req.url,true);
	if(route[0] === "*" || route[0] == req.method) {
		var reg = new RegExp(
			"^"+route[1]
			.replace(
				/\{([\w]+?)(\|[\s\S]+?)?(\/)?\}/g,
				function(m,key,sub,slash){
					keys.push(key);
					if(sub) {
						return sub;
					}
					if(slash == '/') {
						return "((/[^/?*:;{}\\\\]+)+)";
					}
					return "([\\w0-9.-]+)";
				}
			)+
		"$");

		//console.log(reg,uri.pathname)
		if("static.dir" == route[2]) {
			
		}
		if(reg.test(uri.pathname)) {
			uri.pathname.replace(reg,function(m){
				for(var i = 1, l = keys.length; i <= l; ++i) {
					params[keys[i-1]] = arguments[i];
				}
			});
			var env = ({}).merge(list.controllers)
			              .merge(params)
			              .merge({static: staticRoute});

			try {
				action = route[2].runInNewContext(env);
			} catch(e) {
				if(e.name == "TypeError") {
					return;
				} else throw e;
			}

			var id = action.id, run, bits = id.split('.');

			if(["static.file","static.dir"].some(id)) {
				run = action.bind(null,res,route[3]);
			} else {
				methods = instance(res,bits[0],bits[1]);
				run = action.bind(action.context.merge(methods));
			}
			run.params = params;
			return run;
		}
	}
};