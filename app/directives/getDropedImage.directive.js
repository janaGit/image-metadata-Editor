System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var GetDropedImageDirective;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            GetDropedImageDirective = (function () {
                function GetDropedImageDirective() {
                    this.ee_getDropedImage = new core_1.EventEmitter();
                }
                GetDropedImageDirective.prototype.fileDroped = function (event) {
                    event.preventDefault();
                    //var path = event.dataTransfer.getData("text");
                    var data = event.dataTransfer.files[0];
                    this.ee_getDropedImage.emit(data);
                };
                ;
                GetDropedImageDirective.prototype.dragOver = function (event) {
                    event.preventDefault();
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], GetDropedImageDirective.prototype, "ee_getDropedImage", void 0);
                GetDropedImageDirective = __decorate([
                    core_1.Directive({
                        selector: '[ee_getDropedImage]',
                        host: {
                            '(drop)': 'fileDroped($event)',
                            '(dragover)': 'dragOver($event)'
                        },
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], GetDropedImageDirective);
                return GetDropedImageDirective;
            }());
            exports_1("GetDropedImageDirective", GetDropedImageDirective);
        }
    }
});
//# sourceMappingURL=getDropedImage.directive.js.map