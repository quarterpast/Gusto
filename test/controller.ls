require! {
  'karma-sinon-expect'.expect
  Controller: '../lib/controller'
  AppController: '../lib'.Controller
}

export
  'Controller':
    'template gets things from app': ->
      r = {}
      t = expect.sinon.stub!.returns r
      class Foo extends Controller
        @app = template: -> t

      expect Foo.template \a \b .to.be r
      expect t .to.be.called-with \a \b

    'can be extended via Estira': ->
      Foo = Controller.extend \Foo bar: ->

      expect new Foo .to.be.a Controller
      expect new Foo .to.have.property \bar
      expect Foo.display-name .to.be \Foo

    'render':
      'renders things from template': ->
        class Foo extends Controller
          @app = template: ->
            expect.sinon.stub!.with-args \foo.bar .returns 'hello world'

          bar: -> @render {}

        expect (Foo.handle \bar []) {}
          .to.be 'hello world'


  'AppController':
    'keeps track of subclasses': ->
      class Foo extends AppController
      expect AppController.subclasses .to.have.property \Foo Foo
