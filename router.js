const buffer = require("mvc/buffer.js"),
staticroute = require("staticroute.js"),
url = require("url"),
querystring = require("querystring");
module.exports = function(req,res) {
	
	//@TODO: parse headers, request body
	routes.filter(require("router.js").bind(null,req));
	//@TODO: write out the content
};
