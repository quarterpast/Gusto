const fs = require("fs"),
      path = require("path");


function fromFiles(folder,skip) {
	var objects = {},
	files = fs.readDirSync(folder).filter(function(f) {
		return f.endsWith(".js");
	});
	files.each(function(file) {
		if(file === skip) continue;
		var basename = file.remove(/\.js$/);
		objects[basename] = require(path.join(folder,file));
	});
	return objects;
}

exports.controllers = function(id) {
	return fromFiles("app/controllers",id);
}
exports.models = function(id) {
	return fromFiles("app/models",id);
}
exports.isModel = function(m) {
	return fromFiles("app/models").indexOf(m) !== -1;
}
exports.isController = function(m) {
	return this.fromFiles("app/controllers").indexOf(m) !== -1;
}
exports.isAction = function(m) {
	return Object.isFunction(m) && "id" in m;
}