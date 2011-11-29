importPackage(java.io);
function fromFiles(folder,skip) {
	var files = new File(folder).listFiles()
	                .filter(function(f) f.getName().substr(-3) == ".js"),
	    objects = {};
	for each(let file in files) {
		if(file.getName() === skip) continue;
		let basename = file.getName().substring(0,file.getName().length()-3)
		objects[basename] = require(file.getPath())[basename];
	}
	return objects;
}

exports.controllers = function(id) fromFiles("app/controllers",id);
exports.models = function(id) fromFiles("app/models",id);
exports.isModel = function(m) this.fromFiles("app/models").indexOf(m) !== -1;
exports.isController = function(m) this.fromFiles("app/controllers").indexOf(m) !== -1;
exports.isAction = function(m) Object.isFunction(m) && "id" in m;
exports.models = function(id) this.fromFiles("app/models",id);