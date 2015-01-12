module.exports = function(assets) {
    var path = require("path");
    var appRoot = path.dirname(require.main.filename);

    assets.addJs(path.join(appRoot, 'public/javascripts/jquery-2.1.3.min.js'));
    assets.addJs(path.join(appRoot, 'public/javascripts/bootstrap.min.js'));
    assets.addJs(path.join(appRoot, 'public/javascripts/knockout-3.2.0.min.js'));
    assets.addJs(path.join(appRoot, 'public/javascripts/knockout.mapping-2.4.1.min.js'));
    assets.addJs(path.join(appRoot, 'public/javascripts/moment-with-locales.min.js'));
    assets.addJs(path.join(appRoot, 'public/javascripts/login.js'));
    assets.addJs(path.join(appRoot, 'public/javascripts/stats.js'));
    assets.addJs(path.join(appRoot, 'public/javascripts/md5.js'));
};