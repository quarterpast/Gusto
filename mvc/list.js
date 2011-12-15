const fs = require("fs"),
      path = require("path"),
      hot = require("hot.js");

function fromFiles(thing) {
	fs.readDir(path.join("app",thing),function(err,files) {
		if(err) throw err;
		files.each(function(file) {
			function save(module) {
				exports[thing][base] = module;
			}
			if(path.extName(file) == '.js') {
				var base = path.baseName(file,".js");
				new hot.load(path,save).on("reload",save);
			}
		});
	});
}

exports.models = {};
exports.controllers = {};

fromFiles("models");
fromFiles("controllers");

//@TODO:  checkers