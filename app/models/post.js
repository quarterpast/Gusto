const mvc = require("mvc.js").init(module.id),
      models = mvc.models(module.id)
exports.post = mvc.model({
	title: String,
	date: Date,
	content: String
});