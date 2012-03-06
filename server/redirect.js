(function(){
  module.exports = function(req, res, path){
    res.writeHead(302, {
      Location: path
    });
    return res.end();
  };
  module.exports.id = 'redirect';
}).call(this);
