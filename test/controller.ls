require! {
  'karma-sinon-expect'.expect
  Controller: '../lib/controller'
}

export 'Controller':
  'template gets things from app': ->
    r = {}
    t = expect.sinon.stub!.returns r
    class Foo extends Controller
      @app = template: -> t

    expect Foo.template \a \b .to.be r
    expect t .to.be.called-with \a \b
    
