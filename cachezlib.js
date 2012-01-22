const zlib = require("zlib"),
stream = require("stream"),
util = require("util");

module.exports = function CachedComp(method) {
	if(!("create"+method in zlib))
		throw new TypeError(
			util.format("'%s' is not a valid compression method",method)
		);
	
	var cache = {};
	return function(id,size,options) {
		if(id in cache) return cache[id];

		var that = zlib["create"+method](options || {});
		var offset = 0;
		var buffer = new Buffer(size);
		that.on("data",function(chunk) {
			chunk.copy(buffer,offset);
			offset += chunk.length;
		}).on("end",function() {
			var actual = new Buffer(offset), enc;
			buffer.copy(actual);
			cache[id] = new stream.Stream();
			cache[id].readable = true;
			cache[id].setEncoding = function(newEnc) {
				enc = newEnc;
			};
			cache[id].resume = function() {
				var out = enc ? actual.toString(enc) : actual;
				cache[id].emit("data",out);
			};
		});
		
		return that;
	};
};
const fs = require("fs");
var cg = module.exports("Gzip"),size = fs.statSync("lipsum.txt").size;

for(var i=0; i<3; ++i) {
	console.time(i);
	var r = fs.createReadStream("lipsum.txt"),
	w = fs.createWriteStream("lipsum.txt.gz");

	r.resume();
	r.pipe(cg("lipsum.txt",size)).pipe(w);
	console.timeEnd(i);
}