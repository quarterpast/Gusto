const mvc = require("mvc.js").init(module.id),
      app = require("app.js");
exports.post = mvc.model({
	title: String,
	date: Date,
	content: String
});