(function(){
  var util, pathutil, Loader, async, Log, Renderer, Models, Model;
  util = require('util');
  pathutil = require('path');
  Loader = require("./loader").Loader;
  async = require("../magic").async;
  Log = require("../log").Log;
  Renderer = require("./renderer").Renderer;
  exports.Models = Models = (function(){
    Models.displayName = 'Models';
    var prototype = Models.prototype, constructor = Models;
    function Models(){
      throw Error('unimplemented');
    }
    return Models;
  }());
  exports.Model = Model = (function(){
    Model.displayName = 'Model';
    var prototype = Model.prototype, constructor = Model;
    function Model(){
      throw Error('unimplemented');
    }
    return Model;
  }());
}).call(this);
