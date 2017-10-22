
import * as child_process from 'child_process';
import * as readline from 'readline';
import * as prefix from "../utilities/image-prefixes";
export class ExifTool {
  private _languages = ['cs', 'de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'nl', 'pl', 'ru', 'sv', 'tr', 'zh_cn', 'zh_tw'];

  public getMetadata(imageDir, imageName, lang) {
    var json = {};
    var _lang = 'en'
    if (this._languages.indexOf(lang) > -1) {
      _lang = lang;
    }
    var ls = child_process.spawn('exiftool', [imageDir + '/' + imageName, '-lang', _lang]);
    return new Promise((fulfill, reject) => {
      ls.stdout.on('data', (data) => {
        console.log('exifTool getMetadata: ' + data);
        var lines = data.toString().split('\n');
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].toString();
          var key = line.substr(0, line.indexOf(':')).trim();
          var value = line.substring(line.indexOf(':') + 1).trim();
          if ((key.indexOf('Error') > -1 || (value.indexOf('Unknown') === -1)) && value.length != 0) {
            json[key] = value;
          }

        }
        fulfill(json);
      });
      ls.stderr.on('data', (data) => {
        console.error('exifTool getMetadata error: ' + data);
        reject(data);
      });
    });
  }
  public deleteAllMetadata(imageDir, imageName) {
    return new Promise((resolve, reject) => {
      if (imageName.indexOf("editedx") === -1) {
        let imageName_x = imageName.replace(prefix.IMAGE_EDITED, prefix.METADATA_DELETED);
        const ls = child_process.spawn('exiftool', ['-all=', '-tagsFromFile', '@', '-orientation', '-overwrite_original', '-filename=' + imageDir + '/' + imageName_x, imageDir + '/' + imageName]);
        ls.stdout.on('data', (data) => {
          console.log('exifTool message:' + data);
          resolve(data);
        });
        ls.stderr.on('data', (data: string) => {
          console.error('exifTool error:' + data);
          if (data.includes('Warning: No writable tags set from ')) {
            resolve(data);
          }
          reject(data);
        });
      } else {
        resolve("metadata of image:" + imageName + " has already been deleted");
      }

    });



  }

}
