System.register(['angular2/http', 'rxjs/Observable', 'angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var http_1, Observable_1, core_1;
    var ImageService;
    return {
        setters:[
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ImageService = (function () {
                function ImageService(_http) {
                    this._http = _http;
                    this._getImagesUrl = '/getImageNames';
                    this._getImages_editedUrl = '/getImageNames_edited';
                    this._postImageUrl = '/newImage';
                    this._deleteImageUrl = '/deleteImage';
                    this._postMoveImage_Back = '/moveImageBackForEditing';
                    this._postMoveImage_ToImageGallery = '/moveImageToImageGallery';
                }
                ImageService.prototype.getImageNames = function () {
                    return this._http.get(this._getImagesUrl)
                        .map(this.extractData)
                        .catch(this.handleError);
                };
                ImageService.prototype.getImageNames_edited = function () {
                    return this._http.get(this._getImages_editedUrl)
                        .map(this.extractData)
                        .catch(this.handleError);
                };
                ImageService.prototype.extractData = function (res) {
                    if (res.status < 200 || res.status >= 300) {
                        throw new Error('Bad response status: ' + res.status);
                    }
                    var body = res.json();
                    return body.data || {};
                };
                ImageService.prototype.handleError = function (error) {
                    var err = error.message || 'Server error';
                    console.error(err);
                    return Observable_1.Observable.throw(err);
                };
                ImageService.prototype.sendImage = function (imageFile) {
                    var self = this;
                    return new Promise(function (resolve, reject) {
                        var request = new XMLHttpRequest();
                        request.open('POST', self._postImageUrl, true);
                        var formData = new FormData();
                        formData.append('image', imageFile);
                        request.onloadend = function () {
                            resolve(request.responseText);
                        };
                        request.send(formData);
                    });
                };
                ImageService.prototype.deleteImage = function (imageName) {
                    return this._http.delete(this._deleteImageUrl + '/' + imageName)
                        .map(this.extractData)
                        .catch(this.handleError);
                };
                ImageService.prototype.moveImageBackForEditing = function (imageName) {
                    return this._http.post(this._postMoveImage_Back + '/' + imageName, "")
                        .map(this.extractData)
                        .catch(this.handleError);
                };
                ImageService.prototype.moveImageToImageGallery = function (imageName) {
                    return this._http.post(this._postMoveImage_ToImageGallery + '/' + imageName, "")
                        .map(this.extractData)
                        .catch(this.handleError);
                };
                Object.defineProperty(ImageService.prototype, "imageDir", {
                    get: function () {
                        return this._imageDir;
                    },
                    set: function (imgDir) {
                        this._imageDir = imgDir;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ImageService.prototype, "imageDir_edited", {
                    get: function () {
                        return this._imageDir_edited;
                    },
                    set: function (imgDir_edited) {
                        this._imageDir_edited = imgDir_edited;
                    },
                    enumerable: true,
                    configurable: true
                });
                ImageService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ImageService);
                return ImageService;
            }());
            exports_1("ImageService", ImageService);
        }
    }
});
//# sourceMappingURL=image.service.js.map