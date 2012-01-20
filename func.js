const crypto = require("crypto"),
util = require("util");

Function.prototype.cache = function() {
	var func = this,args = arguments,
	cache = {};
	return function() {
		var md5 = crypto.createHash("md5"), args2 = arguments,hash;
		if(args.length) {
			Array.create(args).each(function(arg){
				md5.update(util.inspect(args2[arg]));
			});
		} else {
			md5.update(util.inspect(args2));
		}
		hash = md5.digest("hex");
		if(hash in cache) {
			return cache[hash];
		}
		return cache[hash] = func.apply(this,arguments);
	};
};