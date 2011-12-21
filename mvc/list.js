const fs = require("fs"),
      path = require("path"),
      hot = require("hot");

var cache = {};

module.exports = function fromFiles(thing,cb) {
	if(thing in cache) {
		return cb(cache[thing]);
	}
	fs.readdir(path.join("app",thing),function(err,files) {
		var out = {};
		cache[thing] = out;
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
		cb(out);
	});
};