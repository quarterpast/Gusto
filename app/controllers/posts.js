const mvc = require("mvc.js").init(module.id),
      models = mvc.models(module.id)
exports.posts = mvc.controller({
	"index": function(params) {
		this.render(params)
	},
	"new": function(params) {
		print("new")
		var p = models.post.create({
			title: params.title,
			date: params.date,
			content: params.content
		})
		p.save();
		this.render("view",p)
	},
	"test": function() {
		this.render();
	}
});