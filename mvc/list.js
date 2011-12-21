const fs = require("fs"),
      path = require("path"),
      hot = require("hot");


function fromFiles(thing) {
	var out = {};
	fs.readdirSync(path.join("app",thing)).each(function(file) {
		var base = path.basename(file,".js");
		function save(module) {
			out[base] = module;
		}
		if(path.extname(file) == '.js') {
			new hot.load(path.join("app",thing,file),save)
			       .on("reload",save);
		}
	});
	return out;
}
exports.controllers = fromFiles("controllers");
exports.models = fromFiles("models");
exports.isAction = function(func) {
	return "id" in func && exports.controllers.values().some(function(cont) {
		cont.values().map("id").some(func.id);
	})
};