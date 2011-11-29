exports.extend = function(object,string,array,bool,json) {
	var oldstringify = json.stringify;
	json.stringify = function(a,b,c) {
		return oldstringify(a,function(k,v){
			if(v instanceof java.lang.Boolean) {
				return !!v;
			}
			if(!object.isglobal(b)) {
				return b(k,v);
			}
			return v;
		},c);
	};
	Object.defineProperty(string.prototype,"__iterator__", {writable: true, value:function(){
		yield this;
		throw StopIteration;
	}});
	Object.defineProperty(bool.prototype,"and", {writable: true, value:function(a){
		if(this === new Boolean(true)) {
			return a;
		}
		return "";
	}});
	Object.defineProperty(string.prototype,"size",{configurable:true,get:function() 1,set:function(){}});
	Object.defineProperty(array.prototype,"size",{configurable:true,get:function() this.length,set:function(){}});
	Object.defineProperty(array.prototype,"_$", {value:function() this.reduce(function(a,n) a += n,<></>),writable:true});
	Object.defineProperty(object.prototype,"indexOf", {value:function(v) {
		if(i = Object.values(this).indexOf(v) >= 0) {
			return Object.keys(this)[i];
		}
		return -1;
	} ,writable:true});
	object.unbox = function(obj) {
		(function() this).call(null).merge(obj,false);
	};
}