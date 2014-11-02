(function(){
  var fs = require('fs');

  var user = null;
  var fname = './config/user.json';

  fs.exists(fname, function(exists) {
    if (exists) {
      fs.readFile(fname, function (error, data) {
        user = JSON.parse(data);
      });
    } else {
      console.error('Config file "' + fname + '" absent!');
    }
  });

  function middleware() {
    return function (req, res, next) {
      req.user = user;
      next();
    };
  }

  console.log("WARNING: fake auth middleware enabled!");

  exports.middleware = middleware();
})();