const mvc = require("mvc.js").init(module.id),
      models = mvc.models(module.id);
exports.comment = mvc.model({
	title: String,
	date: Date,
	content: String,
	post: models.post
});