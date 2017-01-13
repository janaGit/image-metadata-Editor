System.register(['angular2/http', 'rxjs/Observable', 'angular2/core', 'rxjs/Rx'], function(exports_1, context_1) {
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
    var http_1, Observable_1, core_1, Rx_1;
    var ExifToolService;
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
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            }],
        execute: function() {
            ExifToolService = (function () {
                function ExifToolService(_http) {
                    this._http = _http;
                    this._getMetadata = '/getMetadata';
                    this._getMetadata_edited = '/getMetadata_edited';
                    this._deleteAllMetadata = '/deleteAllMetadata';
                    this._language = 'en';
                    this._metadata = new Rx_1.Subject();
                    this._metadata_edited = new Rx_1.Subject();
                    this.metadata$ = this._metadata.asObservable();
                    this.metadata_edited$ = this._metadata_edited.asObservable();
                }
                Object.defineProperty(ExifToolService.prototype, "language", {
                    get: function () {
                        return this._language;
                    },
                    set: function (language) {
                        this._language = language;
                        this.requestMetadata();
                        this.requestMetadata_edited();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExifToolService.prototype, "imageName", {
                    get: function () {
                        return this._imageName;
                    },
                    set: function (imgName) {
                        this._imageName = imgName;
                        this.requestMetadata();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExifToolService.prototype, "imageName_edited", {
                    get: function () {
                        return this._imageName_edited;
                    },
                    set: function (imgName) {
                        this._imageName_edited = imgName;
                        this.requestMetadata_edited();
                    },
                    enumerable: true,
                    configurable: true
                });
                ExifToolService.prototype.requestMetadata = function () {
                    var _this = this;
                    this._http.get(this._getMetadata + '/' + this.imageName + '/' + this._language)
                        .map(this.extractData)
                        .catch(this.handleError).subscribe(function (data) { _this._metadata.next(data); }, function (error) { _this._metadata.next(error); });
                };
                ExifToolService.prototype.requestMetadata_edited = function () {
                    var _this = this;
                    this._http.get(this._getMetadata_edited + '/' + this.imageName_edited + '/' + this._language)
                        .map(this.extractData)
                        .catch(this.handleError).subscribe(function (data) { _this._metadata_edited.next(data); }, function (error) { _this._metadata_edited.next(error); });
                };
                ExifToolService.prototype.deleteAllMetadata = function (imageName) {
                    return this._http.post(this._deleteAllMetadata + '/' + imageName, "")
                        .map(this.extractData)
                        .catch(this.handleError);
                };
                ExifToolService.prototype.extractData = function (res) {
                    if (res.status < 200 || res.status >= 300) {
                        throw new Error('Bad response status: ' + res.status);
                    }
                    var body = res.json();
                    return body.data || {};
                };
                ExifToolService.prototype.handleError = function (error) {
                    var err = error.message || 'Server error';
                    console.error(err);
                    return Observable_1.Observable.throw(err);
                };
                ExifToolService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ExifToolService);
                return ExifToolService;
            }());
            exports_1("ExifToolService", ExifToolService);
        }
    }
});
//# sourceMappingURL=exifTool.service.js.map