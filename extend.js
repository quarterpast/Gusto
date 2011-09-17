exports.extend = function(object,string,array) {
	[
		'String',
		'Number',
		'Undefined',
		'Function',
		'Array',
		'Object',
		"global"
	].forEach(function(type) {
		object['is'+type] = function(test) {
			return object.prototype.toString.call(test) === '[object '+type+']';
		};
	});
	Object.defineProperty(string.prototype,"__iterator__", {writable: true, value:function(){
		yield this;
		throw StopIteration;
	}});
	Object.defineProperty(string.prototype,"chars", {writable: true, value:function(){
		for(let i=0,l=this.length; i<l; ++i) {
			yield this.charAt(i);
		}
		throw StopIteration;
	}});
	Object.defineProperty(string.prototype,"size",{configurable:true,get:function() 1,set:function(){}});
	Object.defineProperty(array.prototype,"size",{configurable:true,get:function() this.length,set:function(){}});
	Object.defineProperty(string.prototype,"parseQuery", {writable:true,value:function() {
		if(this == "") return {};
		var parts = this.split("&"), out = {};
		for each(let part in parts) {
			let comp = part.split("="),
			    k = comp.shift().replace(/\[\]$/,""),
			    v = decodeURIComponent(comp.join("=").replace("+"," "));
			if(v == '') v = true;
			if(k in out) {
				if(object.isArray(out[k])) {
					out[k].push(v);
				} else {
					out[k] = [out[k],v];
				}
			} else {
				out[k] = v;
			}
		}
		return out;
	}});
	Object.defineProperty(array.prototype,"_", {value:function() this.reduce(function(a,n) a += n,<></>),writable:true});
	object.extend = function(d,s,m) {
		for(let p in s) {
			if(s.hasOwnProperty(p)) {
				d[p] = s[p];
			}
		}
		return d;
	};
	object.unbox = function(obj) {
		object.extend((function() this).call(null),obj,true);
	};
}