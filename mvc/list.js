const fs = require("fs"),
      path = require("path"),
      hot = require("hot");

function fromFiles(thing) {
	fs.readdir(path.join("app",thing),function(err,files) {
		if(err) throw err;
		files.each(function(file) {
			function save(module) {
				exports[thing][base] = module;
			}
			if(path.extname(file) == '.js') {
				var base = path.basename(file,".js");
				new hot.load(path.join("app",thing,file),save).on("reload",save);
			}
		});
	});
}

exports.models = {};
exports.controllers = {};

fromFiles("models");
fromFiles("controllers");

//@TODO:  checkers