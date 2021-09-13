"use strict";
/**
 * MonitorListEdits.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Looks for insertions, removals, and moves each time the component receives new
 * children. Communicates these list edits to the consumer giving it the opportunity
 * to animate the edits.
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
exports.MonitorListEdits = void 0;
var React = require("react");
var ReactDOM = require("react-dom");
var assert_1 = require("../../common/assert");
var _ = require("./../utils/lodashMini");
function getPosition(el) {
    return {
        left: el.offsetLeft,
        top: el.offsetTop,
    };
}
function extractChildrenKeys(children) {
    var keys = [];
    if (children) {
        React.Children.forEach(children, function (child, index) {
            if (child) {
                var childReactElement = child;
                (0, assert_1.default)(childReactElement.key !== undefined && childReactElement.key !== null, 'Children passed to a `View` with child animations enabled must have a `key`');
                if (childReactElement.key !== null) {
                    keys.push(childReactElement.key);
                }
            }
        });
    }
    return keys;
}
// Returns true if the children were edited (e.g. an item was added, moved, or removed).
// We use this information to determine whether or not we'll need to play any list edit
// animations.
function childrenEdited(prevChildrenKeys, nextChildrenKeys) {
    return !_.isEqual(prevChildrenKeys, nextChildrenKeys);
}
function createChildrenMap(children) {
    var map = {};
    if (children) {
        React.Children.forEach(children, function (child, index) {
            if (child) {
                var childReactElement = child;
                (0, assert_1.default)('key' in childReactElement, 'Children passed to a `View` with child animations enabled must have a `key`');
                var index_1 = childReactElement.key;
                if (index_1 !== null) {
                    map[index_1] = childReactElement;
                }
            }
        });
    }
    return map;
}
function computePositions(refs) {
    var positions = {};
    _.each(refs, function (ref, key) {
        positions[key] = getPosition(ref.domElement);
    });
    return positions;
}
// The states the React component can be in.
var ComponentPhaseEnum;
(function (ComponentPhaseEnum) {
    // The rest state. The component is not in the middle of anything.
    ComponentPhaseEnum[ComponentPhaseEnum["rest"] = 0] = "rest";
    // The component is about to play an animation. This occurs when the component
    // detected a list edit in componentWillUpdate but hasn't yet gotten the opportunity
    // to start the animation in componentDidUpdate.
    ComponentPhaseEnum[ComponentPhaseEnum["willAnimate"] = 1] = "willAnimate";
    // The component is in the middle of playing an animation. The component should not
    // rerender while in this state.
    ComponentPhaseEnum[ComponentPhaseEnum["animating"] = 2] = "animating";
})(ComponentPhaseEnum || (ComponentPhaseEnum = {}));
var MonitorListEdits = /** @class */ (function (_super) {
    __extends(MonitorListEdits, _super);
    function MonitorListEdits() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._itemRefs = {}; // Updated after render but before componentDidUpdate
        _this._refReplacementCache = {};
        _this._isMounted = false;
        _this._phase = ComponentPhaseEnum.rest;
        return _this;
    }
    MonitorListEdits.prototype.UNSAFE_componentWillMount = function () {
        this._childrenKeys = extractChildrenKeys(this.props.children);
        this._childrenMap = createChildrenMap(this.props.children);
    };
    MonitorListEdits.prototype.componentDidMount = function () {
        this._isMounted = true;
    };
    MonitorListEdits.prototype.componentWillUnmount = function () {
        this._isMounted = false;
    };
    MonitorListEdits.prototype.shouldComponentUpdate = function () {
        return this._phase !== ComponentPhaseEnum.animating;
    };
    MonitorListEdits.prototype.UNSAFE_componentWillUpdate = function (nextProps) {
        (0, assert_1.default)(this._phase !== ComponentPhaseEnum.animating, 'componentWillUpdate should never run while the component is animating due to the implementation of shouldComponentUpdate');
        var prevChildrenKeys = this._childrenKeys;
        var nextChildrenKeys = extractChildrenKeys(nextProps.children);
        this._childrenKeys = nextChildrenKeys;
        if (childrenEdited(prevChildrenKeys, nextChildrenKeys)) {
            var prevChildrenMap_1 = this._childrenMap;
            var nextChildrenMap_1 = createChildrenMap(nextProps.children);
            this._childrenMap = nextChildrenMap_1;
            var removed_1 = [];
            var added_1 = [];
            var other_1 = [];
            Object.keys(prevChildrenMap_1).forEach(function (key) {
                if (!(key in nextChildrenMap_1)) {
                    removed_1.push(prevChildrenMap_1[key]);
                }
            });
            Object.keys(nextChildrenMap_1).forEach(function (key) {
                if (!(key in prevChildrenMap_1)) {
                    added_1.push(nextChildrenMap_1[key]);
                }
                else {
                    other_1.push(nextChildrenMap_1[key]);
                }
            });
            this._phase = ComponentPhaseEnum.willAnimate;
            this._willAnimatePhaseInfo = {
                added: added_1,
                removed: removed_1,
                other: other_1,
                prevPositions: computePositions(this._itemRefs),
                prevChildrenMap: prevChildrenMap_1,
            };
        }
    };
    MonitorListEdits.prototype.render = function () {
        var _this = this;
        this._childrenToRender = [];
        // We need to cast this to "any" because of a recent bug introduced
        // into React @types where children is redfined as ReactNode rather
        // than ReactNode[].
        _.each(this.props.children, function (child) {
            if (child) {
                var childElement_1 = child;
                var refData = _this._refReplacementCache[childElement_1.key];
                // Reuse the cached replacement ref function instead of recreating it every render, unless the child's ref changes.
                if (!refData || refData.exisiting !== childElement_1.ref) {
                    refData = {
                        replacement: function (refValue) { _this._saveRef(childElement_1, refValue); },
                        exisiting: childElement_1.ref,
                    };
                    _this._refReplacementCache[childElement_1.key] = refData;
                }
                _this._childrenToRender.push(React.cloneElement(childElement_1, { ref: refData.replacement }));
            }
        });
        if (this._phase === ComponentPhaseEnum.willAnimate) {
            _.each(this._willAnimatePhaseInfo.removed, function (childElement) {
                if (childElement) {
                    _this._childrenToRender.push(React.cloneElement(childElement, {
                        ref: function (refValue) {
                            _this._saveRef(childElement, refValue);
                        },
                    }));
                }
            });
        }
        // Do a shallow clone and remove the props that don't
        // apply to div elements.
        var props = _.clone(this.props);
        delete props.componentWillAnimate;
        delete props.testId;
        return (React.createElement("div", __assign({}, props, { "data-test-id": this.props.testId }), this._childrenToRender));
    };
    MonitorListEdits.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        (0, assert_1.default)(this._phase !== ComponentPhaseEnum.animating, 'componentDidUpdate should never run while the component is animating due to the implementation of shouldComponentUpdate');
        if (this._phase === ComponentPhaseEnum.willAnimate) {
            var phaseInfo_1 = this._willAnimatePhaseInfo;
            var prevPositions_1 = phaseInfo_1.prevPositions;
            var nextPositions_1 = computePositions(this._itemRefs);
            var added = phaseInfo_1.added.map(function (child) { return ({
                element: _this._itemRefs[child.key].reactElement,
            }); });
            var removed = phaseInfo_1.removed.map(function (child) {
                var key = child.key;
                var prevPos = prevPositions_1[key];
                var nextPos = nextPositions_1[key];
                return {
                    leftDelta: nextPos.left - prevPos.left,
                    topDelta: nextPos.top - prevPos.top,
                    element: _this._itemRefs[key].reactElement,
                };
            });
            var moved_1 = [];
            phaseInfo_1.other.map(function (child) {
                var key = child.key;
                var prevPos = prevPositions_1[key];
                var nextPos = nextPositions_1[key];
                if (prevPos.left !== nextPos.left || prevPos.top !== nextPos.top) {
                    moved_1.push({
                        leftDelta: nextPos.left - prevPos.left,
                        topDelta: nextPos.top - prevPos.top,
                        element: _this._itemRefs[key].reactElement,
                    });
                }
            });
            this._phase = ComponentPhaseEnum.animating;
            this._willAnimatePhaseInfo = undefined;
            this.props.componentWillAnimate({
                added: added,
                moved: moved_1,
                removed: removed,
            }, function () {
                _this._phase = ComponentPhaseEnum.rest;
                if (_this._isMounted) {
                    _this.forceUpdate();
                }
                phaseInfo_1.removed.forEach(function (child) {
                    var key = child.key;
                    delete _this._refReplacementCache[key];
                });
            });
        }
    };
    MonitorListEdits.prototype._saveRef = function (reactElement, refValue) {
        if (refValue === null) {
            delete this._itemRefs[reactElement.key];
        }
        else {
            // Cache both the react component reference and the corresponding HTML DOM node (for perf reasons).
            this._itemRefs[reactElement.key] = {
                reactElement: refValue,
                domElement: ReactDOM.findDOMNode(refValue),
            };
        }
        (0, assert_1.default)(typeof reactElement.ref === 'function' || reactElement.ref === undefined || reactElement.ref === null, 'Invalid ref: ' + reactElement.ref + '. Only callback refs are supported when using child animations on a `View`');
        // If the creator of the reactElement also provided a ref, call it.
        if (typeof reactElement.ref === 'function') {
            reactElement.ref(refValue);
        }
    };
    return MonitorListEdits;
}(React.Component));
exports.MonitorListEdits = MonitorListEdits;
