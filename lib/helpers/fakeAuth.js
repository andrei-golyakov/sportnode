(function(){
  var fs = require('fs');

  var user = null;
  var fname = './config/user.json';

  fs.exists(fname, function(exists) {
    if (exists) {
      fs.readFile(fname, function (error, data) {
        if (error)
        {
          console.warn('WANING: your env is DEV, but file "' + fname + '" corrupted.');
        }
        user = JSON.parse(data);
        console.log("WARNING: fake auth middleware enabled!");
      });
    } else {
      console.warn('WANING: your env is DEV, but file "' + fname + '" absent.');
    }
  });

  function middleware() {
    return function (req, res, next) {
      if (user){
        req.user = user;
      }
      next();
    };
  }

  exports.middleware = middleware();
})();