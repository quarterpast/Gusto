const mvc = require("mvc.js");
function readBytes(file) {
	if(!file instanceof File) {
		throw new TypeError("are you high?");
	}
	if(file.exists()) {
		let stream = new FileInputStream(file),
		    length = file.length(),
		    bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, length),
		    offset = 0,
		    numRead = 0;
		while (offset < bytes.length
			&& (numRead=stream.read(bytes, offset, bytes.length-offset)) >= 0) {
			offset += numRead;
		}
		stream.close();
		return bytes;
	} else return false;
}


exports.staticDir = function(dir) function(vars) function() {
	var file = new File(dir+"/"+vars.file), bytes;
	if(bytes = readBytes(file)) {
		mvc.stream.set(bytes);
		return {status:200,binary:true,type:(new javax.activation.MimetypesFileTypeMap).getContentType(file)};
	}
	return {status:404}
};
exports.staticFile = function(path) function() function() {
	var file = new File(path);
	if(bytes = readBytes(file)) {
		mvc.stream.set(bytes);
		return {status:200,binary:true,type:(new javax.activation.MimetypesFileTypeMap).getContentType(file)};
	}
	return {status:404}
};