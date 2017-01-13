System.register(['angular2/core', 'rxjs/Rx', './../../services/image.service', './../services/edit_Metadata.service', './../../directives/getDropedImage.directive', './../../modals/showMetadata.component', './../../services/exifTool.service', './../../directives/onMouseOverImage.directive', './../../modals/contextMenuHolder.component'], function(exports_1, context_1) {
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
    var core_1, Rx_1, image_service_1, edit_Metadata_service_1, getDropedImage_directive_1, showMetadata_component_1, exifTool_service_1, onMouseOverImage_directive_1, contextMenuHolder_component_1;
    var FileComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            },
            function (image_service_1_1) {
                image_service_1 = image_service_1_1;
            },
            function (edit_Metadata_service_1_1) {
                edit_Metadata_service_1 = edit_Metadata_service_1_1;
            },
            function (getDropedImage_directive_1_1) {
                getDropedImage_directive_1 = getDropedImage_directive_1_1;
            },
            function (showMetadata_component_1_1) {
                showMetadata_component_1 = showMetadata_component_1_1;
            },
            function (exifTool_service_1_1) {
                exifTool_service_1 = exifTool_service_1_1;
            },
            function (onMouseOverImage_directive_1_1) {
                onMouseOverImage_directive_1 = onMouseOverImage_directive_1_1;
            },
            function (contextMenuHolder_component_1_1) {
                contextMenuHolder_component_1 = contextMenuHolder_component_1_1;
            }],
        execute: function() {
            FileComponent = (function () {
                function FileComponent(_exifToolService, _imageService, _edit_MetadataService) {
                    this._exifToolService = _exifToolService;
                    this._imageService = _imageService;
                    this._edit_MetadataService = _edit_MetadataService;
                    this.imgNumber = 0;
                    this._displayMetadataModal = false;
                    this.start = new core_1.EventEmitter();
                    this._contextMenuElements = [
                        { title: 'transfer to image gallery', subject: new Rx_1.Subject() }
                    ];
                }
                FileComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.imageDir = this._imageService.imageDir;
                    this._contextMenuElements.forEach(function (elements) { return elements.subject.subscribe(function (val) { return _this.contextMenu(val); }); });
                    this.refresh();
                };
                FileComponent.prototype.getDropedImage = function (file) {
                    var self = this;
                    this._imageService.sendImage(file).then(function (fileName) {
                        self.refreshImageList().then(function () {
                            var index = self.getImageNumber(fileName);
                            if (index != -1) {
                                self.imgNumber = index;
                            }
                            self.loadImage(false);
                        });
                    });
                };
                FileComponent.prototype.refresh = function () {
                    var self = this;
                    this.refreshImageList().then(function () { self.loadImage(true); });
                };
                FileComponent.prototype.refreshImageList = function () {
                    var self = this;
                    return new Promise(function (resolve) {
                        self._imageService.getImageNames()
                            .subscribe(function (images) { return self.imageNames = images; }, function (error) { return self.errorMessage_imageService = error; }, function () { return resolve(); });
                    });
                };
                FileComponent.prototype.getImageNumber = function (name) {
                    var index = this.imageNames.findIndex(function (element) {
                        if (name == element) {
                            return true;
                        }
                        return false;
                    });
                    if (index == -1) {
                        console.info('index==-1; ImageName not found in list!');
                    }
                    return index;
                };
                FileComponent.prototype.nextImage = function () {
                    this.imgNumber = this.imgNumber + 1;
                    this.loadImage(false);
                };
                FileComponent.prototype.previousImage = function () {
                    this.imgNumber = this.imgNumber - 1;
                    this.loadImage(false);
                };
                FileComponent.prototype.loadImage = function (start) {
                    if (start == true) {
                        this.imgNumber = 0;
                    }
                    if (this.imgNumber == this.imageNames.length) {
                        this.imgNumber = 0;
                    }
                    else {
                        if (this.imgNumber < 0) {
                            this.imgNumber = this.imageNames.length - 1;
                        }
                    }
                    this.imageName = this.imageNames[this.imgNumber];
                    this._exifToolService.imageName = this.imageName;
                    this.imgPath = this.imageDir + '/' + this.imageName;
                };
                FileComponent.prototype.deleteImage = function () {
                    var _this = this;
                    var self = this;
                    this._imageService.deleteImage(this.imageName).subscribe(function (data) { return _this.refreshImageList().then(function () { self.loadImage(false); }, function (error) { return _this.errorMessage_imageService = error; }); });
                };
                FileComponent.prototype.startEditing = function () {
                    var _this = this;
                    var message = this.metadata_has_Error(this.imageName);
                    message.then(function (data) {
                        _this._edit_MetadataService.setImageName(_this.imageName);
                        _this.start.emit(true);
                    }, function (error) {
                        _this.errorMessage_imageService = error;
                    });
                };
                FileComponent.prototype.metadata_has_Error = function (imageName) {
                    var self = this;
                    return new Promise(function (resolve, reject) {
                        self._exifToolService.requestMetadata();
                        self._exifToolService.metadata$.subscribe(function (data) {
                            if (typeof data['Error'] === 'undefined') {
                                resolve('true');
                            }
                            reject(data['Error']);
                        }, function (error) { reject(error); });
                    });
                };
                FileComponent.prototype.onKey = function (event) {
                    var key = event.key;
                    switch (key) {
                        case 'a':
                            this.previousImage();
                            break;
                        case 'd':
                            this.nextImage();
                            break;
                        case 'w':
                            this.displayMetadataModal();
                    }
                };
                FileComponent.prototype.displayMetadataModal = function () {
                    this._displayMetadataModal = !this._displayMetadataModal;
                };
                FileComponent.prototype.contextMenu = function (val) {
                    var _this = this;
                    if (val === this._contextMenuElements[0].title) {
                        this._imageService.moveImageToImageGallery(this.imageName).subscribe(function (data) { var self = _this; _this.refreshImageList().then(function () { self.loadImage(false); }); }, function (error) { return _this.errorMessage_imageService = error; });
                    }
                };
                FileComponent.prototype.deleteMetadata = function () {
                    var _this = this;
                    this._exifToolService.deleteAllMetadata(this.imageName).subscribe(function (data) { _this.refresh(); }, function (error) { _this.refresh(); _this.errorMessage_imageService = error; });
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], FileComponent.prototype, "start", void 0);
                FileComponent = __decorate([
                    core_1.Component({
                        selector: 'FileTab',
                        templateUrl: 'app/EditMetadata/FileTab/file.component.html',
                        directives: [getDropedImage_directive_1.GetDropedImageDirective, showMetadata_component_1.ShowMetadataComponent, onMouseOverImage_directive_1.OnMouseOverImageDirective, contextMenuHolder_component_1.ContextMenuHolderComponent],
                        styleUrls: ['app/EditMetadata/FileTab/file.component.css'],
                        host: {
                            '(window:keyup)': 'onKey($event)'
                        }
                    }), 
                    __metadata('design:paramtypes', [exifTool_service_1.ExifToolService, image_service_1.ImageService, edit_Metadata_service_1.Edit_MetadataService])
                ], FileComponent);
                return FileComponent;
            }());
            exports_1("FileComponent", FileComponent);
        }
    }
});
//# sourceMappingURL=file.component.js.map