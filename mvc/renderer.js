const extensions = require("template.js"),
fs = require("fs"),
pathutil = require("path"),
tmpl = require("tmpl"),
list = require("mvc/list.js");

module.exports = function Renderer(path,args,layout) {
	var resolved = pathutil.join("app/views/",path+".ejs"),
	old = path,
	that = this;
	fs.readFile(resolved,function(err,data) {
		if(err) throw err;
		var comp, output;
		try {
			comp = tmpl.compile(data.toString(),resolved);
		} catch(e) {
			console.log(e);
		}
		try {
			output = comp.runInNewContext(
				({}).merge(args).merge({
					$: extensions.merge({
						extend: function(daddy) {path = daddy;},
						layout: layout,
						set: function(k,v){args[k]=v;},
						get: function(k,f) {
							return k in args ? args[k] : f || "";
						},
						exists: function(k) {return k in args;}
					}),
					_: list.controllers
				})
			);
		} catch(e) {
			console.log(e);
		}
		if(old != path) {
			new Renderer(path,args,output).on("render",function(output) {
				that.emit("render",output);
			});
		} else {
			that.emit("render",output);
		}
	});
};
module.exports.prototype = new process.EventEmitter();