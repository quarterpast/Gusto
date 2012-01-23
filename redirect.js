module.exports = function redirect(req,res,path) {
	result.writeHead(302,{"Location":path});
	res.end();
}