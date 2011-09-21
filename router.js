const readBytes = require("file.js").readBytes,
      mvc = require("mvc.js").init();
exports.staticDir = function(dir) {return function(vars) {return function() {
	var file = new File(dir+"/"+vars.file), bytes;
	if(bytes = readBytes(file)) {
		mvc.getBuffer().append(new java.lang.String(bytes));
		return {status:200,type:(new javax.activation.MimetypesFileTypeMap).getContentType(file)};
	}
	return {status:404}
};};};
exports.staticFile = function(path) {return function() {return function() {
	var file = new File(path);
	if(bytes = readBytes(file)) {
		mvc.getBuffer().append(new java.lang.String(bytes));
		return {status:200,type:(new javax.activation.MimetypesFileTypeMap).getContentType(file)};
	}
	return {status:404}
};};};