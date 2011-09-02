const mvc = require(require.main.id);
Object.unbox(mvc.fromFiles("app/models",module.id));

exports.post = mvc.model({
	title: String,
	date: Date,
	content: String
});