module.exports = function redirect(req,res,path) {
	res.writeHead(302,{"Location":path});
	res.end();
};
module.exports.id = "redirect";