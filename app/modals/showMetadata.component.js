System.register(['angular2/core', './../services/exifTool.service'], function(exports_1, context_1) {
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
    var core_1, exifTool_service_1;
    var ShowMetadataComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (exifTool_service_1_1) {
                exifTool_service_1 = exifTool_service_1_1;
            }],
        execute: function() {
            ShowMetadataComponent = (function () {
                function ShowMetadataComponent(_exifToolService) {
                    this._exifToolService = _exifToolService;
                    this._display = 'none';
                    this.metadata = {};
                    this.metadata_keys = [];
                }
                ShowMetadataComponent.prototype.toogle_Show_Hide = function () {
                    this._display = this._display !== 'none' ? 'none' : 'block';
                };
                ShowMetadataComponent.prototype.ngOnChanges = function (changes) {
                    if (changes['imageName']) {
                        this.imageName = changes['imageName'].currentValue;
                        this._exifToolService.imageName = this.imageName;
                        this.getMetadata();
                    }
                    if (changes['display']) {
                        this.toogle_Show_Hide();
                    }
                };
                ShowMetadataComponent.prototype.ngOnInit = function () {
                    if (!this.display_start) {
                        this.toogle_Show_Hide();
                    }
                };
                ShowMetadataComponent.prototype.getMetadata = function () {
                    var _this = this;
                    this._exifToolService.metadata$.subscribe(function (data) { _this.metadata = data; _this.metadata_keys = Object.keys(data); }, function (error) { return _this.errorMessage_exifToolService = error; });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ShowMetadataComponent.prototype, "imageName", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ShowMetadataComponent.prototype, "display", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ShowMetadataComponent.prototype, "display_start", void 0);
                ShowMetadataComponent = __decorate([
                    core_1.Component({
                        selector: 'showMetadata',
                        templateUrl: 'app/modals/showMetadata.component.html',
                        styleUrls: ['app/modals/showMetadata.component.css']
                    }), 
                    __metadata('design:paramtypes', [exifTool_service_1.ExifToolService])
                ], ShowMetadataComponent);
                return ShowMetadataComponent;
            }());
            exports_1("ShowMetadataComponent", ShowMetadataComponent);
        }
    }
});
//# sourceMappingURL=showMetadata.component.js.map