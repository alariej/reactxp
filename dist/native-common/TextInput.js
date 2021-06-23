"use strict";
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
exports.TextInput = void 0;
/**
 * TextInput.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform TextInput abstraction.
 */
var PropTypes = require("prop-types");
var React = require("react");
var RN = require("react-native");
var AutoFocusHelper_1 = require("../common/utils/AutoFocusHelper");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var EventHelpers_1 = require("./utils/EventHelpers");
var Styles_1 = require("./Styles");
var _styles = {
    defaultTextInput: Styles_1.default.createTextInputStyle({
        borderWidth: 0,
        padding: 0,
    }),
};
var TextInput = /** @class */ (function (_super) {
    __extends(TextInput, _super);
    function TextInput(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._selection = { start: 0, end: 0 };
        _this._onMount = function (component) {
            _this._mountedComponent = component || undefined;
        };
        _this._onFocus = function (e) {
            _this.setState({ isFocused: true });
            if (_this.props.onFocus) {
                _this.props.onFocus(e);
            }
        };
        _this._onBlur = function (e) {
            _this.setState({ isFocused: false });
            if (_this.props.onBlur) {
                _this.props.onBlur(e);
            }
        };
        _this._onChangeText = function (newText) {
            _this.setState({ inputValue: newText });
            if (_this.props.onChangeText) {
                _this.props.onChangeText(newText);
            }
        };
        _this._onSelectionChange = function (e) {
            var selection = e.nativeEvent.selection;
            /**
             * On Android, clamp the selection start and end indices to be within the bounds of the TextInput's value.
             * If we didn't do this, on Android some Java code would throw an index out of bounds exception when attempting
             * to set the selection. An important detail for this to work is that React Native Android fires `onChangeText`
             * before `onSelectionChange` which means we have the up-to-date TextInput value's length when this handler
             * runs. Whereas in React Native iOS and UWP, those events fire in the reverse order so this handler can't
             * clamp on those platforms.
             */
            var selectionStart = (RN.Platform.OS === 'android')
                ? Math.min(selection.start, _this.state.inputValue.length)
                : selection.start;
            var selectionEnd = (RN.Platform.OS === 'android')
                ? Math.min(selection.end, _this.state.inputValue.length)
                : selection.end;
            _this._selection = { start: selectionStart, end: selectionEnd };
            if (_this.props.onSelectionChange) {
                _this.props.onSelectionChange(selectionStart, selectionEnd);
            }
        };
        _this._onKeyPress = function (e) {
            if (_this.props.onKeyPress) {
                _this.props.onKeyPress(EventHelpers_1.default.toKeyboardEvent(e));
            }
        };
        _this._onPaste = function (e) {
            if (_this.props.onPaste) {
                _this.props.onPaste(e);
            }
        };
        _this._onScroll = function (e) {
            if (_this.props.onScroll) {
                var contentOffset = e.nativeEvent.contentOffset;
                _this.props.onScroll(contentOffset.x, contentOffset.y);
            }
        };
        _this.state = {
            inputValue: props.value !== undefined ? props.value : (props.defaultValue || ''),
            isFocused: false,
        };
        return _this;
    }
    TextInput.prototype.UNSAFE_componentWillReceiveProps = function (nextProps) {
        if (nextProps.value !== undefined && nextProps.value !== this.state.inputValue) {
            this.setState({
                inputValue: nextProps.value || '',
            });
        }
    };
    TextInput.prototype.componentDidMount = function () {
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    };
    TextInput.prototype._render = function (props, onMount) {
        return (React.createElement(RN.TextInput, __assign({}, props, { ref: onMount })));
    };
    TextInput.prototype.render = function () {
        var editable = this.props.editable !== false;
        // If blurOnSubmit value is explicitly specified, use it, otherwise auto-blur single line inputs
        var blurOnSubmit = this.props.blurOnSubmit !== undefined ? this.props.blurOnSubmit : !this.props.multiline;
        var internalProps = {
            multiline: this.props.multiline,
            style: Styles_1.default.combine([_styles.defaultTextInput, this.props.style]),
            value: this.state.inputValue,
            autoCorrect: this.props.autoCorrect,
            spellCheck: this.props.spellCheck,
            autoCapitalize: this.props.autoCapitalize,
            keyboardType: this.props.keyboardType,
            editable: editable,
            selectionColor: this.props.selectionColor,
            maxLength: this.props.maxLength,
            placeholder: this.props.placeholder,
            defaultValue: this.props.value,
            placeholderTextColor: this.props.placeholderTextColor,
            onSubmitEditing: this.props.onSubmitEditing,
            onKeyPress: this._onKeyPress,
            onPaste: this._onPaste,
            onChangeText: this._onChangeText,
            onSelectionChange: this._onSelectionChange,
            onFocus: this._onFocus,
            onBlur: this._onBlur,
            onScroll: this._onScroll,
            selection: this._selectionToSet,
            secureTextEntry: this.props.secureTextEntry,
            keyboardAppearance: this.props.keyboardAppearance,
            returnKeyType: this.props.returnKeyType,
            disableFullscreenUI: this.props.disableFullscreenUI,
            blurOnSubmit: blurOnSubmit,
            textBreakStrategy: 'simple',
            accessibilityLabel: this.props.accessibilityLabel,
            allowFontScaling: this.props.allowFontScaling,
            underlineColorAndroid: 'transparent',
            clearButtonMode: this.props.clearButtonMode,
            testID: this.props.testId,
        };
        this._selectionToSet = undefined;
        return this._render(internalProps, this._onMount);
    };
    TextInput.prototype.blur = function () {
        if (this._mountedComponent) {
            this._mountedComponent.blur();
        }
    };
    TextInput.prototype.requestFocus = function () {
        var _this = this;
        AutoFocusHelper_1.FocusArbitratorProvider.requestFocus(this, function () { return _this.focus(); }, function () { return !!_this._mountedComponent; });
    };
    TextInput.prototype.focus = function () {
        if (this._mountedComponent) {
            this._mountedComponent.focus();
        }
    };
    TextInput.prototype.setAccessibilityFocus = function () {
        if (this._mountedComponent) {
            AccessibilityUtil_1.default.setAccessibilityFocus(this);
        }
    };
    TextInput.prototype.isFocused = function () {
        return this.state.isFocused;
    };
    TextInput.prototype.selectAll = function () {
        this._selectionToSet = { start: 0, end: this.state.inputValue.length };
        this._selection = this._selectionToSet;
        this.forceUpdate();
    };
    TextInput.prototype.selectRange = function (start, end) {
        var constrainedStart = Math.min(start, this.state.inputValue.length);
        var constrainedEnd = Math.min(end, this.state.inputValue.length);
        this._selectionToSet = { start: constrainedStart, end: constrainedEnd };
        this._selection = this._selectionToSet;
        this.forceUpdate();
    };
    TextInput.prototype.getSelectionRange = function () {
        return this._selection;
    };
    TextInput.prototype.setValue = function (value) {
        this._onChangeText(value);
    };
    TextInput.contextTypes = {
        focusArbitrator: PropTypes.object,
    };
    return TextInput;
}(React.Component));
exports.TextInput = TextInput;
exports.default = TextInput;
