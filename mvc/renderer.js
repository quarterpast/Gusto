module.exports = function Renderer(path,data) {
	var resolved = pathutil.join("app/views/",path+".ejs"),
	that = this;
	fs.readFile(resolved,function(err,data) {
		if(err) throw err;
		var comp = tmpl.compile(data,resolved),
		output = comp.runInNewContext({
			$: {
				extend: function(daddy) {path = daddy},
				layout: output,
				set: function(k,v){extras[k]=v;},
				get: function(k) {return extras[k]},
				exists: function(k) {return k in extras}
			}
		});

		that.emit("render",output)
	});
}
module.exports.prototype = new process.EventEmitter();