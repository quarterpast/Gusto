const mvc = require(require.main.id);
const models = mvc.fromFiles("app/models",module.id);
var Comment = function(){}
exports.post = mvc.model({
	title: String,
	date: Date,
	content: String,
	comments: [Comment]
});