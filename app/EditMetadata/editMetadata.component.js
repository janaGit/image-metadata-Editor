System.register(['angular2/core', 'ng2-bootstrap/ng2-bootstrap', './FileTab/file.component', './MetadataTab/metadata.component', './LocationTab/location.component', './CompleteTab/complete.component', './services/edit_Metadata.service', './../services/image.service'], function(exports_1, context_1) {
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
    var core_1, ng2_bootstrap_1, file_component_1, metadata_component_1, location_component_1, complete_component_1, edit_Metadata_service_1, image_service_1;
    var EditMetadataComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (ng2_bootstrap_1_1) {
                ng2_bootstrap_1 = ng2_bootstrap_1_1;
            },
            function (file_component_1_1) {
                file_component_1 = file_component_1_1;
            },
            function (metadata_component_1_1) {
                metadata_component_1 = metadata_component_1_1;
            },
            function (location_component_1_1) {
                location_component_1 = location_component_1_1;
            },
            function (complete_component_1_1) {
                complete_component_1 = complete_component_1_1;
            },
            function (edit_Metadata_service_1_1) {
                edit_Metadata_service_1 = edit_Metadata_service_1_1;
            },
            function (image_service_1_1) {
                image_service_1 = image_service_1_1;
            }],
        execute: function() {
            EditMetadataComponent = (function () {
                function EditMetadataComponent(_cdr, _imageService, edit_MetadataService) {
                    this._cdr = _cdr;
                    this._imageService = _imageService;
                    this.edit_MetadataService = edit_MetadataService;
                    this.tabs = [
                        { title: 'File', tab: 'File' },
                        { title: 'Edit Metadata', tab: 'Edit_Metadata', disabled: true },
                        { title: 'Additional Metadata', tab: 'Metadata', disabled: true },
                        { title: 'Location', tab: 'Location', disabled: true },
                        { title: 'Complete', tab: 'Complete', disabled: true }
                    ];
                }
                EditMetadataComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.imgDir = this._imageService.imageDir;
                    this.edit_MetadataService.imageName$.subscribe(function (imgName) {
                        _this.imgPath = _this.imgDir + '/' + imgName;
                    });
                    this.tabs.forEach(function (tab) {
                        if (tab.tab === 'File') {
                            tab.active = true;
                            _this._cdr.detectChanges();
                        }
                    });
                };
                EditMetadataComponent.prototype.startEditing = function () {
                    if (true) {
                        this.tabs.forEach(function (tab) {
                            if (tab.tab === 'File') {
                                tab.disabled = true;
                                tab.active = false;
                            }
                            else {
                                tab.disabled = false;
                                if (tab.tab === 'Edit_Metadata') {
                                    tab.active = true;
                                }
                            }
                        });
                        this._cdr.detectChanges();
                    }
                };
                EditMetadataComponent.prototype.selectTab = function (selectedTab) {
                    var _this = this;
                    this.tabs.forEach(function (tab) {
                        if (tab.title === selectedTab.heading) {
                            _this.selectedTab = tab.tab;
                        }
                    });
                };
                EditMetadataComponent.prototype.click_Abort = function () {
                    for (var i = 0; i < this.tabs.length; i++) {
                        var tab = this.tabs[i];
                        if (tab.tab === 'File') {
                            this.selectedTab = tab.tab;
                            tab.disabled = false;
                            tab.active = true;
                        }
                        else {
                            tab.disabled = true;
                            tab.active = false;
                        }
                    }
                    this._cdr.detectChanges();
                };
                EditMetadataComponent = __decorate([
                    core_1.Component({
                        selector: 'edit-Metadata',
                        directives: [ng2_bootstrap_1.TAB_DIRECTIVES, file_component_1.FileComponent, metadata_component_1.MetadataComponent, location_component_1.LocationComponent, complete_component_1.CompleteComponent],
                        templateUrl: 'app/EditMetadata/editMetadata.component.html',
                        styleUrls: ['app/EditMetadata/editMetadata.component.css'],
                    }), 
                    __metadata('design:paramtypes', [core_1.ChangeDetectorRef, image_service_1.ImageService, edit_Metadata_service_1.Edit_MetadataService])
                ], EditMetadataComponent);
                return EditMetadataComponent;
            }());
            exports_1("EditMetadataComponent", EditMetadataComponent);
        }
    }
});
//# sourceMappingURL=editMetadata.component.js.map