// Helps accessing to the configuration.

(function(){
    var fs = require('fs');
    var path = require('path');
    var configContent = fs.readFileSync(path.join(__dirname, '../../config.json'));
    var config = JSON.parse(configContent);

    console.log("Call of config initialization.");

    exports.config = config;
})();
