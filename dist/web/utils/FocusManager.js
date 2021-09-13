"use strict";
/**
 * FocusManager.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Manages focusable elements for better keyboard navigation (web version)
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
exports.applyFocusableComponentMixin = exports.FocusManager = void 0;
var ReactDOM = require("react-dom");
var AutoFocusHelper_1 = require("../../common/utils/AutoFocusHelper");
var FocusManager_1 = require("../../common/utils/FocusManager");
var Timers_1 = require("../../common/utils/Timers");
var UserInterface_1 = require("../UserInterface");
var ATTR_NAME_TAB_INDEX = 'tabindex';
var ATTR_NAME_ARIA_HIDDEN = 'aria-hidden';
var _isShiftPressed;
var FocusManager = /** @class */ (function (_super) {
    __extends(FocusManager, _super);
    function FocusManager(parent) {
        return _super.call(this, parent) || this;
    }
    // Not really public
    FocusManager.initListeners = function () {
        // The default behaviour on Electron is to release the focus after the
        // Tab key is pressed on a last focusable element in the page and focus
        // the first focusable element on a consecutive Tab key press.
        // We want to avoid losing this first Tab key press.
        var _checkFocusTimer;
        // Checking if Shift is pressed to move the focus into the right direction.
        window.addEventListener('keydown', function (event) {
            _isShiftPressed = event.shiftKey;
        });
        window.addEventListener('keyup', function (event) {
            _isShiftPressed = event.shiftKey;
        });
        document.body.addEventListener('focusout', function (event) {
            if (!UserInterface_1.default.isNavigatingWithKeyboard() || (event.target === document.body)) {
                return;
            }
            if (_checkFocusTimer) {
                Timers_1.default.clearTimeout(_checkFocusTimer);
            }
            if (FocusManager._skipFocusCheck) {
                // When in between the FocusManager restrictions,
                // don't check for the focus change here, FocusManager
                // will take care of it.
                FocusManager._skipFocusCheck = false;
                return;
            }
            _checkFocusTimer = Timers_1.default.setTimeout(function () {
                _checkFocusTimer = undefined;
                if (UserInterface_1.default.isNavigatingWithKeyboard() &&
                    (!FocusManager._currentFocusedComponent || !FocusManager._currentFocusedComponent.removed) &&
                    (!document.activeElement || (document.activeElement === document.body))) {
                    // This should work for Electron and the browser should
                    // send the focus to the address bar anyway.
                    FocusManager.focusFirst(_isShiftPressed);
                }
            }, 100);
        });
    };
    FocusManager.prototype.addFocusListenerOnComponent = function (component, onFocus) {
        try {
            var el = ReactDOM.findDOMNode(component);
            if (el) {
                el.addEventListener('focus', onFocus);
            }
        }
        catch (_a) {
            // Swallow exception due to component unmount race condition.
        }
    };
    FocusManager.prototype.removeFocusListenerFromComponent = function (component, onFocus) {
        try {
            var el = ReactDOM.findDOMNode(component);
            if (el) {
                el.removeEventListener('focus', onFocus);
            }
        }
        catch (_a) {
            // Swallow exception due to component unmount race condition.
        }
    };
    FocusManager.prototype.focusComponent = function (component) {
        try {
            var el = ReactDOM.findDOMNode(component);
            if (el && el.focus) {
                FocusManager.setLastFocusedProgrammatically(el);
                el.focus();
                return true;
            }
        }
        catch (_a) {
            // Swallow exception due to component unmount race condition.
        }
        return false;
    };
    FocusManager.setLastFocusedProgrammatically = function (element) {
        this._lastFocusedProgrammatically = element;
    };
    FocusManager.getLastFocusedProgrammatically = function (reset) {
        var ret = FocusManager._lastFocusedProgrammatically;
        if (ret && reset) {
            FocusManager._lastFocusedProgrammatically = undefined;
        }
        return ret;
    };
    FocusManager._isComponentAvailable = function (storedComponent) {
        return !storedComponent.accessibleOnly &&
            !storedComponent.removed &&
            !storedComponent.restricted &&
            storedComponent.limitedCount === 0 &&
            storedComponent.limitedCountAccessible === 0;
    };
    FocusManager._getFirstFocusable = function (last, parent) {
        var focusable = Object.keys(FocusManager._allFocusableComponents)
            .filter(function (componentId) { return !parent || (componentId in parent._myFocusableComponentIds); })
            .map(function (componentId) { return FocusManager._allFocusableComponents[componentId]; })
            .filter(FocusManager._isComponentAvailable)
            .map(function (storedComponent) { return ({ storedComponent: storedComponent, el: ReactDOM.findDOMNode(storedComponent.component) }); })
            .filter(function (f) { return f.el && typeof (f.el.focus) === 'function' && ((f.el.tabIndex || 0) >= 0) && !f.el.disabled; });
        if (focusable.length) {
            focusable.sort(function (a, b) {
                // Some element which is mounted later could come earlier in the DOM,
                // so, we sort the elements by their appearance in the DOM.
                if (a === b) {
                    return 0;
                }
                return a.el.compareDocumentPosition(b.el) & document.DOCUMENT_POSITION_PRECEDING ? 1 : -1;
            });
            return focusable[last ? focusable.length - 1 : 0];
        }
        return undefined;
    };
    FocusManager.focusFirst = function (last) {
        var first = FocusManager._getFirstFocusable(last);
        if (first) {
            var storedComponent_1 = first.storedComponent;
            AutoFocusHelper_1.FocusArbitratorProvider.requestFocus(storedComponent_1.component, function () {
                FocusManager.setLastFocusedProgrammatically(first.el);
                first.el.focus();
            }, function () { return FocusManager._isComponentAvailable(storedComponent_1); }, AutoFocusHelper_1.FocusCandidateType.FocusFirst);
        }
    };
    FocusManager.prototype.resetFocus = function (focusFirstWhenNavigatingWithKeyboard) {
        if (FocusManager._resetFocusTimer) {
            Timers_1.default.clearTimeout(FocusManager._resetFocusTimer);
            FocusManager._resetFocusTimer = undefined;
        }
        if (UserInterface_1.default.isNavigatingWithKeyboard() && focusFirstWhenNavigatingWithKeyboard) {
            // When we're in the keyboard navigation mode, we want to have the
            // first focusable component to be focused straight away, without the
            // necessity to press Tab.
            var first_1 = FocusManager._getFirstFocusable(false, FocusManager._currentRestrictionOwner);
            if (first_1) {
                var storedComponent_2 = first_1.storedComponent;
                AutoFocusHelper_1.FocusArbitratorProvider.requestFocus(storedComponent_2.component, function () {
                    FocusManager.setLastFocusedProgrammatically(first_1.el);
                    first_1.el.focus();
                }, function () { return FocusManager._isComponentAvailable(storedComponent_2); }, AutoFocusHelper_1.FocusCandidateType.FocusFirst);
            }
        }
        else if ((typeof document !== 'undefined') && document.body && document.body.focus && document.body.blur) {
            // An example to explain this part:
            // We've shown a modal dialog which is higher in the DOM by clicking
            // on a button which is lower in the DOM, we've applied the restrictions
            // and only the elements from the modal dialog are focusable now.
            // But internally the browser keeps the last focus position in the DOM
            // (even if we do blur() for the button) and when Tab is pressed again,
            // the browser will start searching for the next focusable element from
            // this position.
            // This means that the first Tab press will get us to the browser's address
            // bar (or nowhere in case of Electron) and only the second Tab press will
            // lead us to focusing the first focusable element in the modal dialog.
            // In order to avoid losing this first Tab press, we're making <body>
            // focusable, focusing it, removing the focus and making it unfocusable
            // back again.
            // Defer the work to avoid triggering sync layout.
            FocusManager._resetFocusTimer = Timers_1.default.setTimeout(function () {
                FocusManager._resetFocusTimer = undefined;
                var currentFocused = FocusManager._currentFocusedComponent;
                if (currentFocused && !currentFocused.removed && !currentFocused.restricted) {
                    // No need to reset the focus because it's moved inside the restricted area
                    // already (manually or with autofocus).
                    return;
                }
                var prevTabIndex = FocusManager._setTabIndex(document.body, -1);
                FocusManager.setLastFocusedProgrammatically(document.body);
                document.body.focus();
                document.body.blur();
                FocusManager._setTabIndex(document.body, prevTabIndex);
            }, 100);
        }
    };
    FocusManager.prototype._updateComponentFocusRestriction = function (storedComponent) {
        var newAriaHidden = storedComponent.restricted || (storedComponent.limitedCount > 0) ? true : undefined;
        var newTabIndex = newAriaHidden || (storedComponent.limitedCountAccessible > 0) ? -1 : undefined;
        var restrictionRemoved = newTabIndex === undefined;
        if ((storedComponent.curTabIndex !== newTabIndex) || (storedComponent.curAriaHidden !== newAriaHidden)) {
            var el = ReactDOM.findDOMNode(storedComponent.component);
            if (el) {
                if (storedComponent.curTabIndex !== newTabIndex) {
                    storedComponent.curTabIndex = newTabIndex;
                    if (restrictionRemoved) {
                        FocusManager._setTabIndex(el, storedComponent.origTabIndex);
                    }
                    else {
                        var prevTabIndex = FocusManager._setTabIndex(el, newTabIndex);
                        if (!('origTabIndex' in storedComponent)) {
                            storedComponent.origTabIndex = prevTabIndex;
                        }
                    }
                }
                if (storedComponent.curAriaHidden !== newAriaHidden) {
                    storedComponent.curAriaHidden = newAriaHidden;
                    if (restrictionRemoved) {
                        FocusManager._setAriaHidden(el, storedComponent.origAriaHidden);
                    }
                    else {
                        var prevAriaHidden = FocusManager._setAriaHidden(el, newAriaHidden ? 'true' : undefined);
                        if (!('origAriaHidden' in storedComponent)) {
                            storedComponent.origAriaHidden = prevAriaHidden;
                        }
                    }
                }
                if (restrictionRemoved) {
                    delete storedComponent.origTabIndex;
                    delete storedComponent.origAriaHidden;
                }
            }
            FocusManager._callFocusableComponentStateChangeCallbacks(storedComponent, !restrictionRemoved);
        }
    };
    FocusManager._setTabIndex = function (element, value) {
        // If a tabIndex assignment is pending for this element, cancel it now.
        if (FocusManager._setTabIndexTimer && element === FocusManager._setTabIndexElement) {
            Timers_1.default.clearTimeout(FocusManager._setTabIndexTimer);
            FocusManager._setTabIndexTimer = undefined;
            FocusManager._setTabIndexElement = undefined;
        }
        var prev = element.hasAttribute(ATTR_NAME_TAB_INDEX) ? element.tabIndex : undefined;
        if (value === undefined) {
            if (prev !== undefined) {
                element.removeAttribute(ATTR_NAME_TAB_INDEX);
            }
        }
        else if (value !== prev) {
            // Setting tabIndex to -1 on the active element would trigger sync layout. Defer it.
            if (value === -1 && element === document.activeElement) {
                // If a tabIndex assignment is pending for another element, run it now as we know
                // that it's not active anymore.
                if (FocusManager._setTabIndexTimer) {
                    FocusManager._setTabIndexElement.tabIndex = -1;
                    Timers_1.default.clearTimeout(FocusManager._setTabIndexTimer);
                    FocusManager._setTabIndexTimer = undefined;
                    FocusManager._setTabIndexElement = undefined;
                }
                FocusManager._setTabIndexElement = element;
                FocusManager._setTabIndexTimer = Timers_1.default.setTimeout(function () {
                    element.tabIndex = value;
                    if (element === FocusManager._setTabIndexElement) {
                        FocusManager._setTabIndexTimer = undefined;
                        FocusManager._setTabIndexElement = undefined;
                    }
                }, 0);
            }
            else {
                element.tabIndex = value;
            }
        }
        return prev;
    };
    FocusManager._setAriaHidden = function (element, value) {
        var prev = element.hasAttribute(ATTR_NAME_ARIA_HIDDEN) ? element.getAttribute(ATTR_NAME_ARIA_HIDDEN) || undefined : undefined;
        if (value === undefined) {
            if (prev !== undefined) {
                element.removeAttribute(ATTR_NAME_ARIA_HIDDEN);
            }
        }
        else {
            element.setAttribute(ATTR_NAME_ARIA_HIDDEN, value);
        }
        return prev;
    };
    FocusManager.sortAndFilterAutoFocusCandidates = function (candidates) {
        return candidates
            .filter(function (candidate) {
            var id = candidate.component.focusableComponentId;
            if (id) {
                var storedComponent = FocusManager._allFocusableComponents[id];
                if (storedComponent &&
                    (storedComponent.removed ||
                        (storedComponent.limitedCount > 0) || (storedComponent.limitedCountAccessible > 0))) {
                    return false;
                }
            }
            return true;
        })
            .map(function (candidate) { return ({ candidate: candidate, el: ReactDOM.findDOMNode(candidate.component) }); })
            .sort(function (a, b) {
            // Some element which is mounted later could come earlier in the DOM,
            // so, we sort the elements by their appearance in the DOM.
            if (a === b) {
                return 0;
            }
            return a.el.compareDocumentPosition(b.el) & document.DOCUMENT_POSITION_PRECEDING ? 1 : -1;
        })
            .map(function (ce) { return ce.candidate; });
    };
    return FocusManager;
}(FocusManager_1.FocusManager));
exports.FocusManager = FocusManager;
function applyFocusableComponentMixin(Component, isConditionallyFocusable) {
    (0, FocusManager_1.applyFocusableComponentMixin)(Component, isConditionallyFocusable);
    var origFocus = Component.prototype.focus;
    if (origFocus) {
        Component.prototype.focus = function () {
            try {
                var el = ReactDOM.findDOMNode(this);
                if (el) {
                    FocusManager.setLastFocusedProgrammatically(el);
                }
            }
            catch (_a) {
                // Swallow exception due to component unmount race condition.
            }
            origFocus.apply(this, arguments);
        };
    }
}
exports.applyFocusableComponentMixin = applyFocusableComponentMixin;
if ((typeof document !== 'undefined') && (typeof window !== 'undefined')) {
    FocusManager.initListeners();
}
exports.default = FocusManager;
