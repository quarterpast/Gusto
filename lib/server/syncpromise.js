(function(){
  var async;
  async = require("../main").async;
  exports.SyncPromise = async((function(){
    function SyncPromise(pr){
      return pr.then.sync(pr);
    }
    return SyncPromise;
  }()));
}).call(this);
