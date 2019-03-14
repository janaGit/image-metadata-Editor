
import * as child_process from 'child_process';
import * as readline from 'readline';
import * as prefix from "../utilities/image-prefixes";
import * as fs from 'fs';
import { ReturnObject } from 'app/types/return-object.interface';

interface ImageData {
  imageName: string,
  imageNameAfterProcessing: string,
  imageDir: string
}
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

  public async deleteAllMetadata(imageDir, imageName): Promise<ReturnObject> {
    let data;
    if (imageName.indexOf("editedx") === -1) {
      let imageName_x = imageName.replace(prefix.IMAGE_EDITED, prefix.METADATA_DELETED);
      const imageData: ImageData = {
        imageName: imageName,
        imageNameAfterProcessing: imageName_x,
        imageDir: imageDir
      }
      try {
        const result = await this.tryProcessDeleteMetadataAndCopyTags(imageData);
        data = new Promise((resolve, reject) => resolve({ message: result, payload: { imageName: imageName_x } }));
      } catch (errorData) {
        if (errorData.includes('Warning: No writable tags set from ')) {
          data = this.copyAndRenameFile(imageData);
        } else {
          data = new Promise((resolve, reject) => reject({ message: errorData, payload: null }));
        }
      }
    } else {
      data = new Promise((resolve, reject) => resolve({ message: "metadata of image:" + imageName + " has already been deleted", payload: { imageName: imageName } }));
    }
    return data;
  }
  private tryProcessDeleteMetadataAndCopyTags(imageData: ImageData): Promise<string> {
    const ls = child_process.spawn('exiftool', ['-all=', '-tagsFromFile', '@', '-orientation', '-overwrite_original', '-filename=' + imageData.imageDir + '/' + imageData.imageNameAfterProcessing, imageData.imageDir + '/' + imageData.imageName]);
    return this.LogAndReturnDataFromChildProcess(ls);
  }
  private async copyAndRenameFile(imageData: ImageData): Promise<string> {
    const callbackFunction = (err) => {
      if (err) throw err;
    }
    try {
      await fs.rename(imageData.imageDir + '/' + imageData.imageName, imageData.imageDir + '/' + imageData.imageNameAfterProcessing);
      return new Promise<string>((resolve, reject) => resolve("Simple file rename as no data were deleted from exiftool! File renamed from: " + imageData.imageName + " to " + imageData.imageNameAfterProcessing + ' in path: ' + imageData.imageDir));
    } catch (e) {
      return new Promise<string>((resolve, reject) => reject("rename error: " + imageData.imageName + " could not be renamed! " + e));
    }
  }

  private LogAndReturnDataFromChildProcess(ls): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      ls.stdout.on('data', (data) => {
        console.log('exifTool message:' + data);
        resolve(data);
      });
      ls.stderr.on('data', (data: string) => {
        console.error('exifTool error:' + data);
        reject(data);
      });
    });
  }

}
