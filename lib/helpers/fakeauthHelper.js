var fakeUser = null;

exports.setup = function(user) {
  if (user !== undefined && user !== null) {
    fakeUser = user;
    console.log('WARNING: fake auth middleware enabled: fakeUser ID = ' + fakeUser.thirdPartyId + '.');
  } else {
    console.warn('WANING: your environment is DEV, but configuration section "fakeDevFakeUser" is empty.');
  }
};

exports.middleware = function () {
  return function (req, res, next) {
    if (fakeUser){
      req.user = fakeUser;
    }
    next();
  };
};
