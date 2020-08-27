
import * as child_process from 'child_process';
import * as readline from 'readline';
import * as constants from "../../utilities/constants";
import * as fs from 'fs';
import { ReturnObject } from '../../src/app/types/return-object.interface';

interface ImageData {
  imageName: string,
  imageNameAfterProcessing: string,
  imageDir: string
}
export class ExifTool {
  private _languages = ['cs', 'de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'nl', 'pl', 'ru', 'sv', 'tr', 'zh_cn', 'zh_tw'];

  public getMetadataHumanreadable(imageDir, imageName, lang) {
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
  public getMetadata(imageDir, imageName) {
    var json = {};

    var ls = child_process.spawn('exiftool', [imageDir + '/' + imageName, '--file:all', '--ExifToolVersion', '-a', '-s',]);
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

  public writeMetadata(imageDir, imageName, metadata) {
    var json = {};
    const metadataArray: string[] = [];
    for (let metadataKey of Object.keys(metadata)) {
      metadataArray.push("-" + metadataKey + "=" + metadata[metadataKey]);
    }
    console.log(metadataArray);

    var ls = child_process.spawn('exiftool', [imageDir + '/' + imageName, ...metadataArray]);
    return new Promise((fulfill, reject) => {
      ls.stdout.on('data', (data) => {
        fulfill("OK");
      });
      ls.stderr.on('data', (data) => {
        console.error('exifTool writeMetadata error: ' + data);
        reject(data);
      });
    });
  }

  public async deleteAllMetadata(imageDir, imageName): Promise<ReturnObject> {
    let data: ReturnObject;
    if (imageName.indexOf("editedx") === -1) {
      let imageName_x = imageName.replace(constants.IMAGE_EDITED, constants.METADATA_DELETED);
      const imageData: ImageData = {
        imageName: imageName,
        imageNameAfterProcessing: imageName_x,
        imageDir: imageDir
      }
      try {
        const result = await this.tryProcessDeleteMetadataAndCopyTags(imageData);
        data = {
          status: 200,
          message: result,
          payload: { imageName: imageName_x }
        };
      } catch (errorData) {
        if (errorData.includes('Warning:')) {
          // const _message = await this.copyAndRenameFile(imageData);
          data = {
            status: 200,
            message: "" + errorData,
            payload: { imageName: imageName_x }
          }
        } else {
          data = {
            status: 500,
            message: "" + errorData,
            payload: null
          };
        }
      }
    } else {
      data = {
        status: 200,
        message: "metadata of image:" + imageName + " has already been deleted",
        payload: { imageName: imageName }
      };
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
      fs.renameSync(imageData.imageDir + '/' + imageData.imageName, imageData.imageDir + '/' + imageData.imageNameAfterProcessing);
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
