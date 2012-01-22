const stream = require("stream");
module.exports = function filter(f) {
	var that = new stream.Stream();
	that.writable = true;
	that.readable = true;
	var buffer = new Buffer(1024);
	offset = 0;

	that.write = function(d,e) {
		if(!Buffer.isBuffer(d)) {
			d = new Buffer(d,e);
		}
		d.copy(buffer,offset);
		offset += d.length;
		return true;
	};
	that.end = function(d,e) {
		if(d) {
			this.write(d,e);
		}
		f.call(this,buffer);
		return true;
	};

	return that;
};

module.exports.identity = module.exports(function(data) {
	this.emit("data",data);
});