importPackage(java.io);
exports.readBytes = function(file) {
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
};