const fs = require("fs"),
      path = require("path"),
      hot = require("hot");

module.exports = function fromFiles(thing) {
	var that = new process.EventEmitter();
	fs.readdir(path.join("app",thing),function(err,files) {
		var out = {}
		if(err) throw err;
		files.each(function(file) {
			function save(module) {
				out[base] = module;
			}
			if(path.extname(file) == '.js') {
				var base = path.basename(file,".js");
				new hot.load(path.join("app",thing,file),save).on("reload",save);
			}
		});
		that.emit("done",out);
	});
	return that;
}
