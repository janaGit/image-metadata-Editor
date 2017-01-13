//The code is from: 
//http://stackoverflow.com/questions/34861628/angular-2-implement-a-custom-context-menu?answertab=oldest#tab-top, 
//post from Abdulrahman, answered Apr 3 at 13:10, 
//plunker: http://plnkr.co/edit/3klGukkbDBCOaBYqcGmr?p=preview
//
//edited by Jana Klemp
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
    var ContextMenuHolderComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (contextMenu_service_1_1) {
                contextMenu_service_1 = contextMenu_service_1_1;
            }],
        execute: function() {
            ContextMenuHolderComponent = (function () {
                function ContextMenuHolderComponent(_contextMenuService) {
                    var _this = this;
                    this._contextMenuService = _contextMenuService;
                    this.links = [];
                    this.isShown = false;
                    this.mouseLocation = { left: 0, top: 0 };
                    this._contextMenuService.show.subscribe(function (e) { return _this.showMenu(e.event, e.obj); });
                }
                Object.defineProperty(ContextMenuHolderComponent.prototype, "locationCss", {
                    // the css for the container div
                    get: function () {
                        return {
                            'position': 'fixed',
                            'display': this.isShown ? 'block' : 'none',
                            left: this.mouseLocation.left + 'px',
                            top: this.mouseLocation.top + 'px',
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                ContextMenuHolderComponent.prototype.clickedOutside = function (event) {
                    this.isShown = false; // hide the menu
                };
                // show the menu and set the location of the mouse
                ContextMenuHolderComponent.prototype.showMenu = function (event, links) {
                    this.isShown = true;
                    this.links = links;
                    this.mouseLocation = {
                        left: event.clientX,
                        top: event.clientY
                    };
                };
                ContextMenuHolderComponent = __decorate([
                    core_1.Component({
                        selector: 'context-menu-holder',
                        styles: [
                            '.container{width:150px;background-color:#eee}',
                            '.link{}', '.link:hover{background-color:#abc}',
                            'ul{margin:0px;padding:0px;list-style-type: none}',
                            '.container{z-index:2;padding-right:0px;border-radius:5px;padding-top:0.5%;padding-bottom:0.5%}',
                            'li{color:#696969;}',
                            'li+li { border-top: 1px solid #696969}'
                        ],
                        host: {
                            '(mouseup)': 'clickedOutside($event)',
                            '(document:mouseup)': 'clickedOutside($event)'
                        },
                        template: "<div [ngStyle]=\"locationCss\" class=\"container\">\n      <ul>\n          <li (mouseup)=\"link.subject.next(link.title)\" class=\"link\" *ngFor=\"#link of links\">\n              {{link.title}}\n          </li>\n      </ul>\n    </div>\n  "
                    }), 
                    __metadata('design:paramtypes', [contextMenu_service_1.ContextMenuService])
                ], ContextMenuHolderComponent);
                return ContextMenuHolderComponent;
            }());
            exports_1("ContextMenuHolderComponent", ContextMenuHolderComponent);
        }
    }
});
//# sourceMappingURL=contextMenuHolder.component.js.map