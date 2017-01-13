System.register(['angular2/core', './../services/contextMenu.service'], function(exports_1, context_1) {
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
    var core_1, contextMenu_service_1;
    var OnMouseOverImageDirective;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (contextMenu_service_1_1) {
                contextMenu_service_1 = contextMenu_service_1_1;
            }],
        execute: function() {
            OnMouseOverImageDirective = (function () {
                function OnMouseOverImageDirective(_contextMenuService) {
                    this._contextMenuService = _contextMenuService;
                    this.ime_onMouseOverImage = new core_1.EventEmitter();
                }
                OnMouseOverImageDirective.prototype.mouseOver = function (event) {
                    var img_name = this.getImage(event);
                    this._event = { event: 'mouseOver', img_name: img_name, element: event.target };
                    this.ime_onMouseOverImage.emit(this._event);
                };
                ;
                OnMouseOverImageDirective.prototype.mouseClicked = function (event) {
                    var img_name = this.getImage(event);
                    this._event = { event: 'mouseClicked', img_name: img_name, element: event.target };
                    this.ime_onMouseOverImage.emit(this._event);
                };
                ;
                OnMouseOverImageDirective.prototype.mouseRightClick = function (event) {
                    event.preventDefault();
                    this._contextMenuService.show.next({ event: event, obj: this.contextMenuElements });
                };
                ;
                OnMouseOverImageDirective.prototype.getImage = function (event) {
                    this._src = event.target.attributes.getNamedItem("src").value;
                    var srcList = this._src.split('/');
                    if (srcList.length > 1) {
                        var img_name = srcList[srcList.length - 1];
                        return img_name;
                    }
                    return '';
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], OnMouseOverImageDirective.prototype, "ime_onMouseOverImage", void 0);
                __decorate([
                    core_1.Input('contextMenuElements'), 
                    __metadata('design:type', Object)
                ], OnMouseOverImageDirective.prototype, "contextMenuElements", void 0);
                OnMouseOverImageDirective = __decorate([
                    core_1.Directive({
                        selector: '[ime_onMouseOverImage]',
                        host: {
                            '(mouseover)': 'mouseOver($event)',
                            '(click)': 'mouseClicked($event)',
                            '(contextmenu)': 'mouseRightClick($event)'
                        }
                    }), 
                    __metadata('design:paramtypes', [contextMenu_service_1.ContextMenuService])
                ], OnMouseOverImageDirective);
                return OnMouseOverImageDirective;
            }());
            exports_1("OnMouseOverImageDirective", OnMouseOverImageDirective);
        }
    }
});
//# sourceMappingURL=onMouseOverImage.directive.js.map