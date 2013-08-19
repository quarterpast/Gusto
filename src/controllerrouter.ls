require! livewire.Router

export class ControllerRouter extends Router
	@supports = (of values Controllers.subclasses)
	match: (req)->
		req.pathname.split '/' .1 is @controller.display-name
	extract: (req)->{}
	handlers: (req)->
		filter (is req.pathname.split '/' .2), @controller.actions!
	(void,@controller)~>
