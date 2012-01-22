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
			var finish = res.end;
			res.end = function() {
				console.timeEnd(process.pid+" "+req.connection.remoteAddress+" "+req.url);
				finish.apply(res,arguments);
			};
			res.on("pipe",function(src){
				src.on("end",function(){
					res.end();
				});
			});
			match[0](match[0].params.merge(get).merge(post));
		} else {
			new ErrorHandler({
				status:404,
				path:req.url
			}).on("render",function(out){
				res.writeHead(404,req.url+" not found");
				res.end(out);
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