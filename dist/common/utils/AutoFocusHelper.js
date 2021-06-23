"use strict";
/**
 * AutoFocusHelper.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Provides the functions which allow to handle the selection of a proper component
 * to focus from the multiple candidates with autoFocus=true.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusArbitratorProvider = exports.setSortAndFilterFunc = exports.FocusCandidateType = void 0;
var Timers_1 = require("./Timers");
var _sortAndFilter;
var _autoFocusTimer;
var _lastFocusArbitratorProviderId = 0;
var rootFocusArbitratorProvider; // eslint-disable-line prefer-const
var FocusCandidateType;
(function (FocusCandidateType) {
    FocusCandidateType[FocusCandidateType["Focus"] = 1] = "Focus";
    FocusCandidateType[FocusCandidateType["FocusFirst"] = 2] = "FocusFirst";
})(FocusCandidateType = exports.FocusCandidateType || (exports.FocusCandidateType = {}));
function setSortAndFilterFunc(sortAndFilter) {
    _sortAndFilter = sortAndFilter;
}
exports.setSortAndFilterFunc = setSortAndFilterFunc;
var FocusArbitratorProvider = /** @class */ (function () {
    function FocusArbitratorProvider(view, arbitrator) {
        this._candidates = [];
        this._pendingChildren = {};
        this._id = ++_lastFocusArbitratorProviderId;
        this._parentArbitratorProvider = view
            ? ((view.context && view.context.focusArbitrator) || rootFocusArbitratorProvider)
            : undefined;
        this._arbitratorCallback = arbitrator;
    }
    FocusArbitratorProvider.prototype._notifyParent = function () {
        if (this._parentArbitratorProvider) {
            this._parentArbitratorProvider._pendingChildren['fa-' + this._id.toString()] = this;
            this._parentArbitratorProvider._notifyParent();
        }
    };
    FocusArbitratorProvider.prototype._arbitrate = function () {
        var _this = this;
        var candidates = this._candidates;
        Object.keys(this._pendingChildren).forEach(function (key) {
            var candidate = _this._pendingChildren[key]._arbitrate();
            if (candidate) {
                candidates.push(candidate);
            }
        });
        this._candidates = [];
        this._pendingChildren = {};
        return FocusArbitratorProvider._arbitrate(candidates, this._arbitratorCallback);
    };
    FocusArbitratorProvider.prototype._requestFocus = function (component, focus, isAvailable, type) {
        var accessibilityId = component.props && component.props.accessibilityId;
        this._candidates.push({
            component: component,
            focus: focus,
            isAvailable: isAvailable,
            type: type,
            accessibilityId: accessibilityId,
        });
        this._notifyParent();
    };
    FocusArbitratorProvider._arbitrate = function (candidates, arbitrator) {
        // Filtering out everything which is already unmounted.
        candidates = candidates.filter(function (item) { return item.isAvailable(); });
        if (_sortAndFilter) {
            candidates = _sortAndFilter(candidates);
        }
        for (var i = 0; i < candidates.length; i++) {
            if (candidates[i].type === FocusCandidateType.FocusFirst) {
                return candidates[i];
            }
        }
        if (arbitrator) {
            // There is an application specified focus arbitrator.
            var toArbitrate_1 = [];
            candidates.forEach(function (candidate) {
                var component = candidate.component;
                // Make sure to pass FocusableComponents only.
                if (component.focus && component.blur && component.requestFocus) {
                    component.__focusCandidateInternal = candidate;
                    toArbitrate_1.push({
                        component: component,
                        accessibilityId: candidate.accessibilityId,
                    });
                }
            });
            if (toArbitrate_1.length) {
                var candidate = arbitrator(toArbitrate_1);
                var ret = void 0;
                if (candidate && candidate.component && candidate.component.__focusCandidateInternal) {
                    ret = candidate.component.__focusCandidateInternal;
                }
                toArbitrate_1.forEach(function (candidate) {
                    delete candidate.component.__focusCandidateInternal;
                });
                return ret;
            }
        }
        return candidates[candidates.length - 1];
    };
    FocusArbitratorProvider.prototype.setCallback = function (arbitrator) {
        this._arbitratorCallback = arbitrator;
    };
    FocusArbitratorProvider.requestFocus = function (component, focus, isAvailable, type) {
        if (_autoFocusTimer) {
            Timers_1.default.clearTimeout(_autoFocusTimer);
        }
        var focusArbitratorProvider = ((component._focusArbitratorProvider instanceof FocusArbitratorProvider) &&
            component._focusArbitratorProvider) ||
            (component.context && component.context.focusArbitrator) ||
            rootFocusArbitratorProvider;
        focusArbitratorProvider._requestFocus(component, focus, isAvailable, type || FocusCandidateType.Focus);
        _autoFocusTimer = Timers_1.default.setTimeout(function () {
            _autoFocusTimer = undefined;
            var candidate = rootFocusArbitratorProvider._arbitrate();
            if (candidate) {
                candidate.focus();
            }
        }, 0);
    };
    return FocusArbitratorProvider;
}());
exports.FocusArbitratorProvider = FocusArbitratorProvider;
rootFocusArbitratorProvider = new FocusArbitratorProvider();
