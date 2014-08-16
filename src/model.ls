require! [taike, cajole, pluralize, \snake-case]

module.exports = class Model
  import taike.decorators

  @schema = ->
    name: @get-table!
    columns: taike @fields!

  @get-table = -> @table ? snake-case pluralize @display-name
  @fields = -> {[k,v] for k,v of this when k not of Model}
  @convert = cajole @fields!

  (props)->
    import @@convert props
