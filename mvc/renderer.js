const extensions = require("template.js"),
fs = require("fs"),
pathutil = require("path"),
tmpl = require("tmpl");

module.exports = function Renderer(path,args,layout) {
	var resolved = pathutil.join("app/views/",path+".ejs"),
	old = path,
	that = this;
	fs.readFile(resolved,function(err,data) {
		if(err) throw err;
		var comp = tmpl.compile(data,resolved),
		output = comp.runInNewContext(args.merge({
			$: extensions.merge({
				extend: function(daddy) {path = daddy;},
				layout: layout,
				set: function(k,v){args[k]=v;},
				get: function(k) {return args[k];},
				exists: function(k) {return k in args;}
			})
		}));
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