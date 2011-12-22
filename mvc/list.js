const fs = require("fs"),
      path = require("path"),
      hot = require("hot");

var cache = {},
loaders = {};

function fromFiles(thing) {
	var out = {};
	exports[thing] = {};
	cache[thing] = out;

	fs.readdirSync(path.join("app",thing)).each(function(file) {
		var base = path.basename(file,".js");
		function save(module) {
			out[base] = exports[thing][base] = module;
		}
		if(path.extname(file) == '.js') {
			exports[thing].__defineGetter__(base,function() {
				if(!(base in loaders)) {
					loaders[base] = new hot.load(
						path.join("app",thing,file)
					).on("reload",save);
				}
				return loaders[base].module;
			});
		}
	});
}

fromFiles("controllers");
fromFiles("models");

exports.isAction = function(func) {
	return "id" in func && exports.controllers.values().some(function(cont) {
		cont.values().map("id").some(func.id);
	})
};