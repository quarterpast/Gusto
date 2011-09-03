const mvc = require(require.main.id);
const models = mvc.fromFiles("app/models");
exports.posts = mvc.controller({
	"index": function(params) {
		this.renderJSON(params)
	},
	"new": function() {
		var p = models.post.create({
			title: "test",
			date: Date.now(),
			content: "this is a test post"
		})
		this.renderJSON(p)
	}
});