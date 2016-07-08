cordova.define("cordova-plugin-videoproc.VideoProcProxy", function(require, exports, module) { var browser = require('cordova/platform');
var cordova = require('cordova');

module.exports = {
    compose: function (videoFile, opt, success, error) {
        setTimeout(function () {
			console.log(videoFile);
			console.log(opt);
            success(videoFile);
        }, 0);
    }
};

require("cordova/exec/proxy").add("VideoProc", module.exports);

});
