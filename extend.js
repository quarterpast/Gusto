exports.extend = function(object,string,array,bool) {
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
	Object.defineProperty(bool.prototype,"and", {writable: true, value:function(a){
		if(this === new Boolean(true)) {
			return a;
		}
		return "";
	}});
	Object.defineProperty(string.prototype,"chars", {writable: true, value:function(){
		for(let i=0,l=this.length; i<l; ++i) {
			yield this.charAt(i);
		}
		throw StopIteration;
	}});
	Object.defineProperty(array.prototype,"contains", {writable: true, value:function(v) (this.indexOf(v) !== -1)});
	Object.defineProperty(string.prototype,"size",{configurable:true,get:function() 1,set:function(){}});
	Object.defineProperty(array.prototype,"size",{configurable:true,get:function() this.length,set:function(){}});
	Object.defineProperty(string.prototype,"parseQuery", {writable:true,value:function() {
		if(this == "") return {};
		var parts = this.split("&"), out = {};
		for each(let part in parts) {
			if(part == "") continue;
			let comp = part.split("="),
			    k = decodeURIComponent(comp.shift()).replace(/\[\]$/,""),
			    v = decodeURIComponent(comp.join("=").replace("+"," "));
			if(!comp.length) v = true;
			if(v == parseFloat(v)) v = parseFloat(v);
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
	object.values = function(s) {
		var r = [];
		for(let p in s) {
			if(s.hasOwnProperty(p)) {
				r.push(s[p]);
			}
		}
		return r;
	};
	Object.defineProperty(array.prototype,"_", {value:function() this.reduce(function(a,n) a += n,<></>),writable:true});
	Object.defineProperty(object.prototype,"indexOf", {value:function(v) {
		if(i = Object.values(this).indexOf(v) >= 0) {
			return Object.keys(this)[i];
		}
		return -1;
	} ,writable:true});
	object.extend = function(d,s) {
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