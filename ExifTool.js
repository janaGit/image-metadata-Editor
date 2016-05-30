var exports = module.exports = {};
        const child_process = require('child_process').spawn;
        const readline = require('readline');
        exports.getMetadata = function (imageDir, imageName) {
        var json = {};
                const ls = child_process('exiftool', [imageDir + '/' + imageName]);
                return new Promise(function(fulfill, reject){
                ls.stdout.on('data', (data) => {
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
                        reject(data);
                        });
                });
        }
exports.deleteAllMetadata = function(imageDir, imageDir_edited, imageName){
        const ls = child_process('exiftool', ['-all=','-overwrite_original', '-filename='+imageDir_edited+'/'+imageName,imageDir+'/'+imageName]);
        return new Promise(function(fulfill, reject){
        ls.stdout.on('data', (data) => { 
            console.log('exifTool message:'+data);
        fulfill(data);
        });
                ls.stderr.on('data', (data) => {
                    console.error('exifTool error:'+data);
                reject(data);
                });
        });
        }

