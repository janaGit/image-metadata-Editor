
import * as child_process from 'child_process';
import * as readline from 'readline';
import * as constants from "../../utilities/constants";
import * as fs from 'fs';
import { ReturnObject } from '../../src/app/types/return-object.interface';
import { AppTemplate } from '../../src/app/types/app-template.interface';
import { ExistingMetadataTemplateMethods } from '../../src/app/types/existing-metadata-templete-methods.type';
import { getKeysFromNestedObject, returnUniqueItems } from '../../utilities/utilitiy-methods';
interface ImageData {
  imageName: string,
  imageNameAfterProcessing: string,
  imageDir: string
}
export class ExifTool {
  private _languages = ['cs', 'de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'nl', 'pl', 'ru', 'sv', 'tr', 'zh_cn', 'zh_tw'];

  private fileNameForCategoryTree = "category-tree.json"
  private configDir = './config';

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

    var ls = child_process.spawn('exiftool', [imageDir + '/' + imageName, '-a', '-s', '-c', '%.16f']);
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

    var ls = child_process.spawn('exiftool', [imageDir + '/' + imageName, "-all=", ...metadataArray]);
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

  public writeMetadataAllImagesSelected(imageDir, imageName: string, metadata: AppTemplate) {
    try {
      var ls_categories = child_process.spawnSync('exiftool', [imageDir + '/' + imageName, "-Categories"]);
      var ls_keywords = child_process.spawnSync('exiftool', [imageDir + '/' + imageName, "-Keywords"]);
      const tags = this.createTags(metadata, ls_categories.stdout, ls_keywords.stdout);
      console.log("createMetadataForProcessing: " + this.createMetadataForProcessing(tags.tagsAndValues).join(" "));
      var ls_categories = child_process.spawnSync('exiftool', [imageDir + '/' + imageName, ...this.createMetadataForProcessing(tags.tagsAndValues), "-tagsFromFile", '@', '-orientation', ...tags.copyFromImage, '-overwrite_original']);
    } catch (e) {
      console.error('exifTool writeMetadataAllImagesSelected() error: ' + e);
    }

  }
  private createMetadataForProcessing(tagsAndValues: Map<string, string>): string[] {
    let strings = [];
    tagsAndValues.forEach((value, key) => {
      strings.push("-" + key + "=" + value);
    });
    return strings;
  }
  private createTags(metadata: AppTemplate, categoriesFromImage: string, keywordsFromImage: any): { tagsAndValues: Map<string, string>, copyFromImage: string[] } {
    let copyFromImage: string[] = [];
    const tagsAndValues = new Map<string, string>();


    if (metadata.existingMetadataTab.method === ExistingMetadataTemplateMethods.COPY_CUSTOM) {
      copyFromImage = metadata.existingMetadataTab.keys;
      tagsAndValues.set("all", "");
    }
    if (metadata.existingMetadataTab.method === ExistingMetadataTemplateMethods.DELETE_CUSTOM) {
      metadata.existingMetadataTab.keys.forEach(key => {
        tagsAndValues.set(key, "");
      });
    }
    if (metadata.existingMetadataTab.method === ExistingMetadataTemplateMethods.DELETE_ALL) {
      tagsAndValues.set("all", "");
    }

    if (metadata.metadataTab.isCreatorCopiedFromImage) {
      copyFromImage.push("Creator");
    } else {
      tagsAndValues.set("Creator", metadata.metadataTab.creator);
    }

    if (metadata.metadataTab.isLicenseCopiedFromImage) {
      copyFromImage.push("License");
    } else {
      tagsAndValues.set("License", metadata.metadataTab.license);
    }

    if (metadata.metadataTab.isContactInfoCopiedFromImage) {
      copyFromImage.push("ContactInfo");
    } else {
      tagsAndValues.set("ContactInfo", metadata.metadataTab.contactInfo);
    }

    if (metadata.metadataTab.areKeywordsCopiedFromImage) {

      if (metadata.metadataTab.areKeywordsToDeleteFromImage) {
        if (typeof keywordsFromImage === "string") {
          const keywords = returnUniqueItems([].concat(keywordsFromImage.split(",").filter(keywordFromImage => typeof metadata.metadataTab.keywords.find(keywordFromTemplate => keywordFromImage === keywordFromTemplate) === "undefined")));
          tagsAndValues.set("Keywords", keywords.join(", "));
        }
      } else {
        if (typeof keywordsFromImage === "string") {
          tagsAndValues.set("Keywords", returnUniqueItems(metadata.metadataTab.keywords.concat(keywordsFromImage.split(","))).join(", "));
        } else {
          tagsAndValues.set("Keywords", metadata.metadataTab.keywords.join(","));
        }
      }

    } else {
      tagsAndValues.set("Keywords", metadata.metadataTab.keywords.join(","));
    }

    if (metadata.metadataTab.isSubjectCopiedFromImage) {
      copyFromImage.push("Subject");
    } else {
      tagsAndValues.set("Subject", metadata.metadataTab.subject);
    }

    if (metadata.metadataTab.isDescriptionCopiedFromImage) {
      copyFromImage.push("Description");
    } else {
      tagsAndValues.set("Description", metadata.metadataTab.description);
    }

    const categoryTree = JSON.parse(fs.readFileSync(this.configDir + "/" + this.fileNameForCategoryTree).toString());
    const supportedCategories = getKeysFromNestedObject(categoryTree);
    let addedCategories = metadata.categoryTab.categories.join(",");
    if (metadata.categoryTab.isNotSupportedCategoriesToCopy && metadata.categoryTab.isSupportedCategoriesToCopy) {
      tagsAndValues.set("Categories", addedCategories + categoriesFromImage);
    }
    if (!metadata.categoryTab.isNotSupportedCategoriesToCopy && metadata.categoryTab.isSupportedCategoriesToCopy) {
      const onlySupportedCategories = categoriesFromImage.split(",").filter(category => supportedCategories.includes(category));
      tagsAndValues.set("Categories", addedCategories + onlySupportedCategories);
    }
    if (metadata.categoryTab.isNotSupportedCategoriesToCopy && !metadata.categoryTab.isSupportedCategoriesToCopy) {
      const notSupportedCategories = categoriesFromImage.split(",").filter(category => !supportedCategories.includes(category));
      tagsAndValues.set("Categories", addedCategories + notSupportedCategories);

    }
    if (!metadata.categoryTab.isNotSupportedCategoriesToCopy && !metadata.categoryTab.isSupportedCategoriesToCopy) {
      tagsAndValues.set("Categories", addedCategories);
    }



    if (metadata.locationTab.isLocationDisabledByDefault) {
      tagsAndValues.set("GPSLatitude", "");
      tagsAndValues.set("GPSLongitude", "");
    } else {
      if (metadata.locationTab.isLocationCopiedFromImage) {
        copyFromImage.push("GPSLatitude");
        copyFromImage.push("GPSLongitude");
      } else {
        tagsAndValues.set("GPSLatitude", metadata.locationTab.latitude + "");
        tagsAndValues.set("GPSLongitude", metadata.locationTab.longitude + "");
      }
    }
    if (metadata.locationTab.isTimeDisabledByDefault) {
      tagsAndValues.set("DateTimeOriginal", "");
    } else {
      if (metadata.locationTab.isTimeCopiedFromImage) {
        copyFromImage.push("DateTimeOriginal");
      } else {
        tagsAndValues.set("DateTimeOriginal", metadata.locationTab.dateAndTime.toString());
      }
    }
    return { tagsAndValues, copyFromImage }
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
