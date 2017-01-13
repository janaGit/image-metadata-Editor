var exports = module.exports = {};
        var child_process = require('child_process').spawn;
        var readline = require('readline');
        
        var _languages=['cs','de','en','es','fr','it','ja','ko','nl','pl','ru','sv','tr','zh_cn','zh_tw'];
        
exports.getMetadata = function (imageDir, imageName, lang) {
        var json = {};
        var _lang='en'
        if(_languages.indexOf(lang)>-1){
           _lang=lang; 
        }
                var ls = child_process('exiftool', [imageDir + '/' + imageName, '-lang', _lang]);
                return new Promise(function(fulfill, reject){
                ls.stdout.on('data', (data) => {
                console.log('exifTool getMetadata: ' + data);
                        var lines = data.toString().split('\n');
                        for (var i = 0; i < lines.length; i++) {
                var line = lines[i].toString();
                        var key = line.substr(0, line.indexOf(':')).trim();
                        var value = line.substring(line.indexOf(':') + 1).trim();
                        if ((key.indexOf('Error') > - 1 || (value.indexOf('Unknown') === - 1)) && value.length != 0) {
                json[key] = value;
                }

                }
                fulfill(json);
                });
                        ls.stderr.on('data', (data) => {
                        console.error('exifTool getMetadata: ' + data);
                                reject(data);
                        });
                });
        }
exports.deleteAllMetadata = function(imageDir, imageDir_edited, imageName){
const ls = child_process('exiftool', ['-all=', '-tagsFromFile', '@', '-orientation', '-overwrite_original', '-filename=' + imageDir_edited + '/' + imageName, imageDir + '/' + imageName]);
        return new Promise(function(fulfill, reject){
        ls.stdout.on('data', (data) => {
        console.log('exifTool message:' + data);
                fulfill(data);
        });
                ls.stderr.on('data', (data) => {
                console.error('exifTool error:' + data);
                        reject(data);
                });
        });
        }

