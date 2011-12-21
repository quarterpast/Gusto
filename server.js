const config = require.main.exports.config,
http = require("http"),
router = require("router.js"),
static = require("static.js"),
list = require("mvc/list.js"),
url = require("url"),
path = require("path"),
querystring = require("querystring"),
fs = require("fs"),
vm = require("vm"),
data = fs.readFileSync(path.join(config.appDir,"conf","routes.conf")).toString(),
routes = data.split(/[\n\r]/).each(function(line) {
	var parts = line.split(/\s+/);
	if(!["*","HEAD","GET","POST","PUT","TRACE","DELETE","OPTIONS","PATCH"].some(parts[0]))
		throw new SyntaxError("Invalid HTTP method "+parts[0]);
	parts[2] = vm.createScript(parts[2],parts[1]);
	return parts;
});

const server = http.createServer(function(req,res) {
	var body = new Buffer(req.headers['content-length']),
	off = 0;
	if(req.method = "POST") {
		req.on("data",function(chunk) {
			off = body.write(chunk,off);
		})
	}
	var match = routes.filter(require("router.js").bind(null,req));
	req.on("end", function() {
		var post = {}, get = url.parse(req.url,true).query;
		if(off) {
			post = querystring.parse(body.toString());
		}
		console.log(match)
	});
}),
port = config[require.main.exports.mode].port || 8000;

exports.go = function() {
	if("address" in config[require.main.exports.mode]) {
		server.listen(
			port,
			config[require.main.exports.mode].address,
			console.log.bind(null,
				"Listening on %s:%d",
				config[require.main.exports.mode].address,
				port
			)
		);
	} else {
		server.listen(
			port,
			console.log.bind(null,
				"Listening on *:%d",
				port
			)
		);
	}
};