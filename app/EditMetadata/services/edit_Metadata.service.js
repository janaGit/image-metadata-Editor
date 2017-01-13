System.register(['angular2/core', 'rxjs/Subject'], function(exports_1, context_1) {
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
    var core_1, Subject_1;
    var Edit_MetadataService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            }],
        execute: function() {
            Edit_MetadataService = (function () {
                function Edit_MetadataService() {
                    this._imageName = new Subject_1.Subject();
                    this.imageName$ = this._imageName.asObservable();
                }
                Edit_MetadataService.prototype.setImageName = function (imgName) {
                    this._imageName.next(imgName);
                };
                Edit_MetadataService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], Edit_MetadataService);
                return Edit_MetadataService;
            }());
            exports_1("Edit_MetadataService", Edit_MetadataService);
        }
    }
});
//# sourceMappingURL=edit_Metadata.service.js.map