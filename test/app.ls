require! {
	'karma-sinon-expect': {expect}
	'../lib': {App}
}

export 'App':
	'template':
		'to send a 200 if template found': (done)->
			class Foo extends App
				views: bar: baz: 'hello'
			
			(new Foo).template! 'bar.baz' {} .to-array ([status])->
				expect status .to.have.property \code 200
				done!

		'to flip a shit if template not found': ->
			class Foo extends App
				views: {}

			expect (-> (new Foo).template! 'bar.baz' {}) .to.throw-exception /Path 'bar\.baz' not found/
		'finds paths from views': (done)->
			class Foo extends App
				views: bar: baz: 'hello'
			
			(new Foo).template! 'bar.baz' {} .to-array ([status, out])->
				expect out .to.be 'hello'
				done!

		'uses template-compile':
			'to munge templates': (done)->
				class Foo extends App
					template-compiler: (t,d)--> 'hi'
					views: bar: baz: 'hello'

				(new Foo).template! 'bar.baz' {} .to-array ([status, out])->
					expect out .to.be 'hi'
					done!

			'passing the template and data': ->
				t = expect.sinon.stub!
					.returns d = expect.sinon.spy!
				class Foo extends App
					template-compiler: t
					views: bar: baz: 'hello'

				(new Foo).template! 'bar.baz' a:\b
				expect t .to.be.called-with 'hello'
				expect d.first-call.args.0 .to.have.property \a \b


