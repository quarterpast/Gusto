// renderer.js
// invokes the template engine, sets up inheritance etc.
const extensions = require("./template.js"),
fs = require("fs"),
pathutil = require("path"),
tmpl = require("tmpl"),
Q = require("q"),
list = require("./list.js"),
config = require("../main.js").config;

module.exports = function Renderer(path,args,action,layout,ajax) {
	var resolved = pathutil.join(config.appDir,"app","views",path+".ejs"),
	old = path,
	that = this;
	fs.readFile(resolved,function(err,data) {
		if(err) throw err;
		// a raw template was requested, let's oblige them
		if(ajax) return that.emit("render",data);
		var comp, output = "";
		try {
			comp = tmpl.compile(data.toString(),resolved);
		} catch(e) {
			console.log("compilation error");
			that.emit("error",e);
			return;
		}
		var ctx = Object.clone(args,true).merge({
			$: extensions.merge({
				action: action,
				layout: layout,
				extend: function(daddy) {
					path = daddy;
				},
				set: function(k,v){
					args[k]=v;
				},
				get: function(k,f) {
					return k in args ? args[k] : f || "";
				},
				exists: function(k) {
					return k in args;
				},
				include: function(path,extras) {
					extras = extras || {};
					var rend = new Renderer(path,Object.merge(extras,args))
					.on("error",function(e) {
						that.emit("error",e);
					});
					console.log(rend)
					return {
						toString: function() {
							return rend.output;
						}
					}
				}
			}),
			_: list.controllers
		});
		Q.all(comp.map(function(promise) {
				var out;
				console.log(promise);
				if(promise.call) {
					out = Q.call(promise,ctx);
				} else if(promise.runInNewContext) {
					out = promise.runInNewContext(ctx);
				} else {
					out = promise.toString();
				}
				return Q.when(out);
		})).spread(function(){
			var o = '';
			for(var i = 0,l = arguments.length; i<l; ++i) {
				o += arguments[i];
			}
			return o;
		}).then(function(out) {
			that.emit("render",out);
		},function error(e){
			that.emit("error",e);
		}).end();
		if(old != path) {
			// $.extend was call, so now we compile that template
			new Renderer(path,args,action,output,false).on("render",function(output) {
				that.emit("render",output);
			}).on("error",function(e){
				that.emit("error",e);
			});
		} else {
			that.emit("render",output);
		}
	});
};
module.exports.prototype = new process.EventEmitter();