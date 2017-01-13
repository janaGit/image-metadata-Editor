System.register(['angular2/core', 'rxjs/Rx', './../services/image.service', './../directives/onMouseOverImage.directive', './../services/exifTool.service', './../modals/contextMenuHolder.component'], function(exports_1, context_1) {
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
    var core_1, Rx_1, image_service_1, onMouseOverImage_directive_1, exifTool_service_1, contextMenuHolder_component_1;
    var ImageGallery;
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
            function (onMouseOverImage_directive_1_1) {
                onMouseOverImage_directive_1 = onMouseOverImage_directive_1_1;
            },
            function (exifTool_service_1_1) {
                exifTool_service_1 = exifTool_service_1_1;
            },
            function (contextMenuHolder_component_1_1) {
                contextMenuHolder_component_1 = contextMenuHolder_component_1_1;
            }],
        execute: function() {
            ImageGallery = (function () {
                function ImageGallery(_imageService, _exifToolService, _renderer) {
                    this._imageService = _imageService;
                    this._exifToolService = _exifToolService;
                    this._renderer = _renderer;
                    this.metadata = {};
                    this.metadata_keys = [];
                    this._editedImages_text = "images_edited.txt";
                    this._contextMenuElements = [
                        { title: 'transfer for editing', subject: new Rx_1.Subject() }
                    ];
                }
                ImageGallery.prototype.ngOnInit = function () {
                    var _this = this;
                    this.getImageNames();
                    this.imgDir_edited = this._imageService.imageDir_edited;
                    this._contextMenuElements.forEach(function (elements) { return elements.subject.subscribe(function (val) { return _this.contextMenu(val); }); });
                    var event = { pageY: document.body.scrollTop };
                    this.onScroll(event);
                };
                ImageGallery.prototype.onMouseOverImage = function (event) {
                    if (event.event === 'mouseOver') {
                        this._actual_Image = event.img_name;
                        if (typeof this._imageNameClicked === 'undefined') {
                            this.getMetadata(event.img_name);
                        }
                    }
                    if (event.event === 'mouseClicked') {
                        if (this._imageNameClicked !== event.img_name) {
                            this.getMetadata(event.img_name);
                            this._imageNameClicked = event.img_name;
                            this._renderer.setElementClass(event.element, 'clicked', true);
                        }
                        else {
                            this._imageNameClicked = undefined;
                            this._renderer.setElementClass(event.element, 'clicked', false);
                        }
                    }
                };
                ImageGallery.prototype.getMetadata = function (imageName) {
                    var _this = this;
                    this._exifToolService.imageName_edited = imageName;
                    this._exifToolService.metadata_edited$.subscribe(function (data) { _this.metadata = data; _this.metadata_keys = Object.keys(data); }, function (error) { return _this.errorMessage_exifToolService = error; });
                };
                ImageGallery.prototype.imageClicked = function (imgName) {
                    if (this._imageNameClicked === imgName) {
                        return true;
                    }
                    return false;
                };
                ImageGallery.prototype.contextMenu = function (val) {
                    var _this = this;
                    if (val === this._contextMenuElements[0].title) {
                        this._imageService.moveImageBackForEditing(this._actual_Image).subscribe(function (data) { _this.getImageNames(); }, function (error) { return _this.errorMessage_exifToolService = error; });
                    }
                };
                ImageGallery.prototype.removeString = function (array, string) {
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].indexOf(string) > -1) {
                            array.splice(i, 1);
                        }
                    }
                    return array;
                };
                ImageGallery.prototype.getImageNames = function () {
                    var _this = this;
                    this._imageService.getImageNames_edited().subscribe(function (images) {
                        images = _this.removeString(images, _this._editedImages_text);
                        _this._imageNames_edited = images;
                    }, function (error) { _this._errorMessage_imageService = error; });
                };
                ImageGallery.prototype.onScroll = function (event) {
                    var grow_limit = Math.floor(0.25 * window.innerHeight);
                    if (event.pageY <= grow_limit) {
                        this._metadata_table_height = 'calc(70vh + ' + event.pageY + 'px)';
                    }
                };
                ImageGallery.prototype.onKey = function (event) {
                    var key = event.key;
                    switch (key) {
                        case 's':
                            this._renderer.invokeElementMethod(this.table.nativeElement, 'scrollBy', [0, 50]);
                            break;
                        case 'w':
                            this._renderer.invokeElementMethod(this.table.nativeElement, 'scrollBy', [0, -50]);
                    }
                };
                __decorate([
                    core_1.ViewChild('table'), 
                    __metadata('design:type', Object)
                ], ImageGallery.prototype, "table", void 0);
                ImageGallery = __decorate([
                    core_1.Component({
                        templateUrl: 'app/ImageGallery/image_Gallery.component.html',
                        styleUrls: ['app/ImageGallery/image_Gallery.component.css'],
                        directives: [onMouseOverImage_directive_1.OnMouseOverImageDirective, contextMenuHolder_component_1.ContextMenuHolderComponent],
                        host: {
                            '(document:scroll)': 'onScroll($event)',
                            '(window:keypress)': 'onKey($event)'
                        }
                    }), 
                    __metadata('design:paramtypes', [image_service_1.ImageService, exifTool_service_1.ExifToolService, core_1.Renderer])
                ], ImageGallery);
                return ImageGallery;
            }());
            exports_1("ImageGallery", ImageGallery);
        }
    }
});
//# sourceMappingURL=image_Gallery.component.js.map