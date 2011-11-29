exports.buffer = (function() {
	var buffer;
	return {
		get: function() buffer,
		set: function(b) buffer = b
	}
}());
exports.stream = (function() {
	var stream;
	return {
		get: function() stream,
		set: function(b) stream = b
	}
}());