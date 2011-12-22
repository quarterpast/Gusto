const fs = require("fs"),
      path = require("path"),
      hot = require("hot");

var cache = {};
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
			new hot.load(path.join("app",thing,file)).on("reload",save);
			exports[thing].__defineGetter__(base,function() {
				return require(path.join("app",thing,file));
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