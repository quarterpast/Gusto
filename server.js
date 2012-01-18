const config = require.main.exports.config,
http = require("http"),
router = require("router.js"),
list = require("mvc/list.js"),
static = require("static.js"),
ErrorHandler = require("error.js"),
url = require("url"),
path = require("path"),
querystring = require("querystring"),
fs = require("fs"),
vm = require("vm"),
data = fs.readFileSync(path.join(config.appDir,"conf","routes.conf")).toString(),
routes = data.split(/[\n\r]/).map(function(line) {
	var parts = line.split(/\s+/);
	if(line.startsWith("#")) return;
	if(parts.length < 2) return;
	if(!["*","HEAD","GET","POST","PUT","TRACE","DELETE","OPTIONS","PATCH"].some(parts[0]))
		throw new SyntaxError("Invalid HTTP method "+parts[0]);
	parts[2] = vm.createScript(parts[2],parts[1]);
	return parts;
}).compact();
const server = http.createServer(function Listen(req,res) {
	console.time(process.pid+" "+req.connection.remoteAddress+" "+req.url);
	var body = new Buffer(req.headers['content-length'] || 0),
	off = 0,
	match = [];
	if(req.method == "POST") {
		req.on("data",function(chunk) {
			off = body.write(chunk,off);
		});
	}
	try {
		match = routes.map(
		                require("router.js")
		                .bind(null,req,res)
		              ).compact();
	} catch(e) {
		console.log(e.stack);
	}
	req.on("end", function() {
		var post = {}, get = url.parse(req.url,true).query;
		if(off) {
			post = querystring.parse(body.toString());
		}
		if(match.length) {
			var queue = [];
			res.on("queue",function() {
				Array.create(arguments).each(function(arg) {
					queue.push(arg);
				});
			});
			res.on("clearQueue",function() {
				queue = [];
			});
			res.on("done",function(status,reason,headers) {
				if(Object.isObject(reason)) {
					headers = reason;
					reason = "";
				}
				res.writeHead(status,headers);
				queue.each(function(action) {
					res[action.shift()].apply(res,action);
				});
				res.end();
				console.timeEnd(process.pid+" "+req.connection.remoteAddress+" "+req.url);
			});
			match[0](match[0].params.merge(get).merge(post));
		} else {
			new ErrorHandler({
				status:404,
				path:req.url
			}).on("render",function(out){
				res.writeHead(404,req.url+" not found");
				res.write(out);
				res.end();
				console.timeEnd(process.pid+" "+req.connection.remoteAddress+" "+req.url);
			});
		
		}
	});
}),
port = config[require.main.exports.mode].port || 8000;
exports.go = function() {
	if("address" in config[require.main.exports.mode]) {
		server.listen(
			port,
			config[require.main.exports.mode].address,
			console.log.bind(null,
				"%d listening on %s:%d",
				process.pid,
				config[require.main.exports.mode].address,
				port
			)
		);
	} else {
		server.listen(
			port,
			console.log.bind(null,
				"%d listening on *:%d",
				process.pid,
				port
			)
		);
	}
};