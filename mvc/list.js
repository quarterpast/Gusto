const fs = require("fs"),
      path = require("path"),
      hot = require("hot"),
      controller = require("mvc/controller.js");
var initialisers = {
	controllers: controller
},
loaders = {};
function fromFiles(thing) {
	var out = {};
	exports[thing] = {};

	fs.readdirSync(path.join("app",thing)).each(function(file) {
		var base = path.basename(file,".js"),
		init = thing in initialisers ?
			initialisers[thing] :
			function(a){return a;};
		function save(module) {
			out[base] = exports[thing][base] = init.call(base,module);
		}
		if(path.extname(file) == '.js') {
			exports[thing].__defineGetter__(base,function() {
				if(!(base in loaders)) {
					loaders[base] = new hot.load(
						path.join("app",thing,file)
					).on("reload",save);
				}
				return init.call(base,loaders[base].module);
			});
		}
	});
}

fromFiles("controllers");
fromFiles("models");
fromFiles("filters");

exports.isAction = function(func) {
	var id = Object.isString(func) ? func : func.id;
	return exports.controllers.values().some(function(cont) {
		cont.values().map("id").some(function(t){
			console.log(t===id)
			return t === id;
		});
	});
};