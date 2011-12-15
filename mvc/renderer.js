module.exports = function Renderer(path,args) {
	var resolved = pathutil.join("app/views/",path+".ejs"),
	that = this;
	fs.readFile(resolved,function(err,data) {
		if(err) throw err;
		var comp = tmpl.compile(data,resolved),
		output = comp.runInNewContext({
			$: {
				extend: function(daddy) {path = daddy},
				layout: output,
				set: function(k,v){args[k]=v;},
				get: function(k) {return args[k]},
				exists: function(k) {return k in args}
			}
		});

		that.emit("render",output)
	});
}
module.exports.prototype = new process.EventEmitter();