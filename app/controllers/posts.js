const mvc = require(require.main.id);
const models = mvc.fromFiles("app/models");
exports.posts = mvc.controller({
	"index": function(params) {
		this.renderJSON(params)
	},
	"new": function(params) {
		var p = models.post.create({
			title: params.title,
			date: params.date,
			content: params.content
		})
		this.renderJSON(p)
	},
	"test": function() {
		this.render();
	}
});