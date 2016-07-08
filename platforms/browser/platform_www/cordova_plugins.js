cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-videoproc/www/videoproc.js",
        "id": "cordova-plugin-videoproc.videoproc",
        "pluginId": "cordova-plugin-videoproc",
        "clobbers": [
            "videoproc"
        ]
    },
    {
        "file": "plugins/cordova-plugin-videoproc/src/browser/VideoProcProxy.js",
        "id": "cordova-plugin-videoproc.VideoProcProxy",
        "pluginId": "cordova-plugin-videoproc",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-videoproc": "1.0.0",
    "cordova-plugin-whitelist": "1.2.2"
}
// BOTTOM OF METADATA
});