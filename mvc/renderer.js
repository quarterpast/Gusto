const extensions = require("../template.js"),
fs = require("fs"),
pathutil = require("path"),
tmpl = require("tmpl"),
list = require("./list.js"),
config = require("../main.js").config;

module.exports = function Renderer(path,args,action,layout,ajax) {
	var resolved = pathutil.join(config.appDir,"app","views",path+".ejs"),
	old = path,
	that = this;
	fs.readFile(resolved,function(err,data) {
		if(err) throw err;
		if(ajax) return that.emit("render",data);
		var comp, output = "";
		try {
			comp = tmpl.compile(data.toString(),resolved);
		} catch(e) {
			console.log("compilation error");
			that.emit("error",e);
			return;
		}
		try {
			this.output = output = comp.runInNewContext(
				Object.clone(args,true).merge({
					$: extensions.merge({
						action: action,
						layout: layout,
						extend: function(daddy) {
							path = daddy;
						},
						set: function(k,v){
							args[k]=v;
						},
						get: function(k,f) {
							return k in args ? args[k] : f || "";
						},
						exists: function(k) {
							return k in args;
						},
						include: function(path,extras) {
							return new Renderer(path,extras.merge(args))
							.on("error",function(e) {
								that.emit("error",e);
							}).output;
						}
					}),
					_: list.controllers
				})
			);
		} catch(e) {
			console.log("runtime error");
			that.emit("error",e);
			return;
		}
		if(old != path) {
			new Renderer(path,args,action,output,false).on("render",function(output) {
				that.emit("render",output);
			}).on("error",function(e){
				that.emit("error",e);
			});
		} else {
			that.emit("render",output);
		}
	});
};
module.exports.prototype = new process.EventEmitter();