"use strict";
/**
 * AnimateListEdits.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Each time the component receives new children, animates insertions, removals,
 * and moves that occurred since the previous render.
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimateListEdits = void 0;
var React = require("react");
var ReactDOM = require("react-dom");
var executeTransition_1 = require("../animated/executeTransition");
var lodashMini_1 = require("./../utils/lodashMini");
var MonitorListEdits_1 = require("./MonitorListEdits");
var AnimateListEdits = /** @class */ (function (_super) {
    __extends(AnimateListEdits, _super);
    function AnimateListEdits() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimateListEdits.prototype._handleWillAnimate = function (edits, done) {
        var counter = 1;
        var animationCompleted = function () {
            --counter;
            if (counter === 0) {
                done();
            }
        };
        var delay = 0;
        if (edits.removed.length > 0 && this.props.animateChildLeave) {
            edits.removed.forEach(function (move) {
                try {
                    var domNode = ReactDOM.findDOMNode(move.element);
                    if (domNode) {
                        domNode.style.transform = 'translateY(' + -move.topDelta + 'px)';
                        counter++;
                        (0, executeTransition_1.default)(domNode, [{
                                property: 'opacity',
                                from: 1,
                                to: 0,
                                delay: delay,
                                duration: 150,
                                timing: 'linear',
                            }], animationCompleted);
                    }
                }
                catch (_a) {
                    // Exception probably due to race condition in unmounting. Ignore.
                }
            });
            delay += 75;
        }
        if (edits.moved.length > 0 && this.props.animateChildMove) {
            edits.moved.forEach(function (move) {
                counter++;
                try {
                    var domNode = ReactDOM.findDOMNode(move.element);
                    if (domNode) {
                        (0, executeTransition_1.default)(domNode, [{
                                property: 'transform',
                                from: 'translateY(' + -move.topDelta + 'px)',
                                to: '',
                                delay: delay,
                                duration: 300,
                                timing: 'ease-out',
                            }], animationCompleted);
                    }
                }
                catch (_a) {
                    // Exception probably due to race condition in unmounting. Ignore.
                }
            });
        }
        delay += 75;
        if (edits.added.length > 0 && this.props.animateChildEnter) {
            edits.added.forEach(function (move) {
                counter++;
                try {
                    var domNode = ReactDOM.findDOMNode(move.element);
                    if (domNode) {
                        (0, executeTransition_1.default)(domNode, [{
                                property: 'opacity',
                                from: 0,
                                to: 1,
                                delay: delay,
                                duration: 150,
                                timing: 'linear',
                            }], animationCompleted);
                    }
                }
                catch (_a) {
                    // Exception probably due to race condition in unmounting. Ignore.
                }
            });
        }
        animationCompleted();
    };
    AnimateListEdits.prototype.render = function () {
        var _this = this;
        // Do a shallow clone and remove the props that don't
        // apply to the MontiroListEdits component.
        var props = (0, lodashMini_1.clone)(this.props);
        delete props.animateChildEnter;
        delete props.animateChildLeave;
        delete props.animateChildMove;
        return (React.createElement(MonitorListEdits_1.MonitorListEdits, __assign({ componentWillAnimate: function (edits, done) { return _this._handleWillAnimate(edits, done); } }, props), this.props.children));
    };
    return AnimateListEdits;
}(React.Component));
exports.AnimateListEdits = AnimateListEdits;
exports.default = AnimateListEdits;
