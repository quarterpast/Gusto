exports.write = function() {

};
const config = require.main.exports.config,
http = require("http"),
router = require("router.js"),
staticroute = require("staticroute.js"),
list = require("mvc/list.js"),
url = require("url"),
querystring = require("querystring"),
routes = require(config.appDir+"/conf/routes.js").call(staticroute,list.controllers()),
server = http.createServer(function(req,res) {
	var body = new Buffer(req.headers['content-length']), off = 0;
	if(req.method = "POST") {
		req.on("data",function(chunk) {
			off = body.write(chunk,off);
		})
	}
	routes.filter(require("router.js").bind(null,req));
	req.on("end", function() {
		var post = {}, get = url.parse(req.url,true).query;
		if(off) {
			post = querystring.parse(body.toString());
		}
		//@TODO: write out the content
	});
}),
port = config[config.appMode].port || 8000;

exports.go = function() {
	if("address" in config[config.appMode]) {
		server.listen(
			port,
			config[config.appMode].address,
			console.log.bind(null,
				"Listening on %s:%d",
				config[config.appMode].address,
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