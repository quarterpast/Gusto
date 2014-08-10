require! {
	BaseController: sodor.Controller
	awdry
	estira.extend
}

module.exports = class Controller extends BaseController
	import awdry
	import {extend}

	@set-templates = (@template =)
