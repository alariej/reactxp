"use strict";
/**
 * Storage.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of the cross-platform database storage abstraction.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
var RX = require("../common/Interfaces");
var PromiseDefer_1 = require("../common/utils/PromiseDefer");
var Storage = /** @class */ (function (_super) {
    __extends(Storage, _super);
    function Storage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Storage.prototype.getItem = function (key) {
        var deferred = new PromiseDefer_1.Defer();
        import('@react-native-async-storage/async-storage')
            .then(function (AsyncStorage) {
            AsyncStorage.default.getItem(key, function (error, result) {
                if (!error) {
                    deferred.resolve(result || undefined);
                }
                else {
                    deferred.reject(error);
                }
            }).catch(function (err) {
                deferred.reject(err);
            });
        })
            .catch(function (err) {
            deferred.reject(err);
        });
        return deferred.promise();
    };
    Storage.prototype.setItem = function (key, value) {
        var deferred = new PromiseDefer_1.Defer();
        import('@react-native-async-storage/async-storage')
            .then(function (AsyncStorage) {
            AsyncStorage.default.setItem(key, value, function (error) {
                if (!error) {
                    deferred.resolve(void 0);
                }
                else {
                    deferred.reject(error);
                }
            }).catch(function (err) {
                deferred.reject(err);
            });
        })
            .catch(function (err) {
            deferred.reject(err);
        });
        return deferred.promise();
    };
    Storage.prototype.removeItem = function (key) {
        var deferred = new PromiseDefer_1.Defer();
        import('@react-native-async-storage/async-storage')
            .then(function (AsyncStorage) {
            AsyncStorage.default.removeItem(key, function (error) {
                if (!error) {
                    deferred.resolve(void 0);
                }
                else {
                    deferred.reject(error);
                }
            }).catch(function (err) {
                deferred.reject(err);
            });
        })
            .catch(function (err) {
            deferred.reject(err);
        });
        return deferred.promise();
    };
    Storage.prototype.clear = function () {
        var deferred = new PromiseDefer_1.Defer();
        import('@react-native-async-storage/async-storage')
            .then(function (AsyncStorage) {
            AsyncStorage.default.clear(function (error) {
                if (!error) {
                    deferred.resolve(void 0);
                }
                else {
                    deferred.reject(error);
                }
            }).catch(function (err) {
                deferred.reject(err);
            });
        })
            .catch(function (err) {
            deferred.reject(err);
        });
        return deferred.promise();
    };
    return Storage;
}(RX.Storage));
exports.Storage = Storage;
exports.default = new Storage();
