"use strict";
/**
 * TextInput.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform TextInput abstraction.
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
exports.TextInput = void 0;
var PropTypes = require("prop-types");
var React = require("react");
var AutoFocusHelper_1 = require("../common/utils/AutoFocusHelper");
var FocusManager_1 = require("./utils/FocusManager");
var lodashMini_1 = require("./utils/lodashMini");
var Styles_1 = require("./Styles");
var _isMac = (typeof navigator !== 'undefined') && (typeof navigator.platform === 'string') && (navigator.platform.indexOf('Mac') >= 0);
// Cast to any to allow merging of web and RX styles
var _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        flexBasis: 'auto',
        flexGrow: 0,
        flexShrink: 0,
        overflowX: 'hidden',
        overflowY: 'auto',
        alignItems: 'stretch',
    },
    formStyle: {
        display: 'flex',
        flex: 1,
    },
};
var TextInputPlaceholderSupport = /** @class */ (function () {
    function TextInputPlaceholderSupport() {
    }
    TextInputPlaceholderSupport.getClassName = function (color) {
        var key = this._colorKey(color);
        return "reactxp-placeholder-" + key;
    };
    TextInputPlaceholderSupport.addRef = function (color) {
        if (typeof document === undefined) {
            return;
        }
        var cache = this._cachedStyles;
        var key = this._colorKey(color);
        if (cache.hasOwnProperty(key)) {
            cache[key].refCounter++;
        }
        else {
            var className = this.getClassName(color);
            var style = document.createElement('style');
            style.type = 'text/css';
            style.textContent = this._getStyle(className, color);
            document.head.appendChild(style);
            cache[key] = {
                refCounter: 1,
                styleElement: style,
            };
        }
    };
    TextInputPlaceholderSupport.removeRef = function (color) {
        var cache = this._cachedStyles;
        var key = this._colorKey(color);
        if (cache.hasOwnProperty(key)) {
            var item = cache[key];
            if (--item.refCounter < 1) {
                var styleElement = item.styleElement;
                if (styleElement.parentNode) {
                    styleElement.parentNode.removeChild(styleElement);
                }
                delete cache[key];
            }
        }
    };
    TextInputPlaceholderSupport._colorKey = function (color) {
        return color.toLowerCase()
            .replace(/(,|\.|#)/g, '_')
            .replace(/[^a-z0-9_]/g, '');
    };
    TextInputPlaceholderSupport._getStyle = function (className, placeholderColor) {
        var selectors = [
            '::placeholder',
            '::-webkit-input-placeholder',
            '::-moz-placeholder',
            ':-moz-placeholder',
            ':-ms-input-placeholder', // IE 10+
        ];
        return selectors
            .map(function (pseudoSelector) {
            return "." + className + pseudoSelector + " {\n" +
                "  opacity: 1;\n" +
                ("  color: " + placeholderColor + ";\n") +
                "}";
        }).join('\n');
    };
    TextInputPlaceholderSupport._cachedStyles = {};
    return TextInputPlaceholderSupport;
}());
var TextInput = /** @class */ (function (_super) {
    __extends(TextInput, _super);
    function TextInput(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._mountedComponent = null;
        _this._selectionStart = 0;
        _this._selectionEnd = 0;
        _this._isFocused = false;
        _this._ariaLiveEnabled = false;
        _this._onMount = function (comp) {
            _this._mountedComponent = comp;
            if (_this._mountedComponent && _this._mountedComponent instanceof HTMLTextAreaElement) {
                TextInput._updateScrollPositions(_this._mountedComponent, !!_this.state.autoResize);
            }
        };
        _this._onMultilineInput = function (ev) {
            _this._onInput();
            TextInput._updateScrollPositions(ev.currentTarget, !!_this.state.autoResize);
        };
        _this._onInput = function () {
            if (_isMac && _this._mountedComponent && _this._isFocused && !_this._ariaLiveEnabled) {
                // VoiceOver does not handle text inputs properly at the moment, aria-live is a temporary workaround.
                // And we're adding aria-live only for the focused input which is being edited, otherwise it might
                // interrupt some required announcements.
                _this._mountedComponent.setAttribute('aria-live', 'assertive');
                _this._ariaLiveEnabled = true;
            }
        };
        _this._onFocus = function (e) {
            if (_this._mountedComponent) {
                _this._isFocused = true;
                if (_this.props.onFocus) {
                    _this.props.onFocus(e);
                }
            }
        };
        _this._onBlur = function (e) {
            if (_this._mountedComponent) {
                _this._isFocused = false;
                if (_isMac && _this._ariaLiveEnabled) {
                    _this._mountedComponent.removeAttribute('aria-live');
                    _this._ariaLiveEnabled = false;
                }
                if (_this.props.onBlur) {
                    _this.props.onBlur(e);
                }
            }
        };
        _this._onPaste = function (e) {
            if (_this.props.onPaste) {
                _this.props.onPaste(e);
            }
            _this._checkSelectionChanged();
        };
        _this._onInputChanged = function (event) {
            if (!event.defaultPrevented) {
                if (_this._mountedComponent) {
                    // Has the input value changed?
                    var value = _this._mountedComponent.value || '';
                    if (_this.state.inputValue !== value) {
                        // If the parent component didn't specify a value, we'll keep
                        // track of the modified value.
                        if (_this.props.value === undefined) {
                            _this.setState({
                                inputValue: value,
                            });
                        }
                        if (_this.props.onChangeText) {
                            _this.props.onChangeText(value);
                        }
                    }
                    _this._checkSelectionChanged();
                }
            }
        };
        _this._checkSelectionChanged = function () {
            if (_this._mountedComponent) {
                if (_this._selectionStart !== _this._mountedComponent.selectionStart ||
                    _this._selectionEnd !== _this._mountedComponent.selectionEnd) {
                    _this._selectionStart = _this._mountedComponent.selectionStart || 0;
                    _this._selectionEnd = _this._mountedComponent.selectionEnd || 0;
                    if (_this.props.onSelectionChange) {
                        _this.props.onSelectionChange(_this._selectionStart, _this._selectionEnd);
                    }
                }
            }
        };
        _this._onKeyDown = function (e) {
            // Generate a "submit editing" event if the user
            // pressed enter or return.
            if (e.keyCode === 13 && (!_this.props.multiline || _this.props.blurOnSubmit)) {
                if (_this.props.onSubmitEditing) {
                    _this.props.onSubmitEditing();
                }
                if (_this.props.blurOnSubmit) {
                    _this.blur();
                }
            }
            if (_this.props.onKeyPress) {
                _this.props.onKeyPress(e);
            }
            _this._checkSelectionChanged();
        };
        _this._onScroll = function (e) {
            var targetElement = e.currentTarget;
            // Fix scrollTop if the TextInput can auto-grow
            // If the item is bounded by max-height, don't scroll since we want input to follow the cursor at that point
            if (_this.state.autoResize && targetElement.scrollHeight < targetElement.clientHeight) {
                targetElement.scrollTop = 0;
            }
            if (_this.props.onScroll) {
                _this.props.onScroll(targetElement.scrollLeft, targetElement.scrollTop);
            }
        };
        _this._focus = function () {
            AutoFocusHelper_1.FocusArbitratorProvider.requestFocus(_this, function () { return _this.focus(); }, function () { return !!_this._mountedComponent; });
        };
        _this.state = {
            inputValue: props.value !== undefined ? props.value : (props.defaultValue || ''),
            autoResize: TextInput._shouldAutoResize(props),
        };
        return _this;
    }
    TextInput.prototype.UNSAFE_componentWillReceiveProps = function (nextProps) {
        var _this = this;
        var nextState = {};
        if (nextProps.value !== undefined && nextProps.value !== this.state.inputValue) {
            nextState.inputValue = nextProps.value;
        }
        if (nextProps.style !== this.props.style || nextProps.multiline !== this.props.multiline) {
            var fixedHeight = TextInput._shouldAutoResize(nextProps);
            if (this.state.autoResize !== fixedHeight) {
                nextState.autoResize = fixedHeight;
            }
        }
        if (nextProps.placeholderTextColor !== this.props.placeholderTextColor) {
            if (nextProps.placeholderTextColor) {
                TextInputPlaceholderSupport.addRef(nextProps.placeholderTextColor);
            }
            if (this.props.placeholderTextColor) {
                TextInputPlaceholderSupport.removeRef(this.props.placeholderTextColor);
            }
        }
        if (!lodashMini_1.isEmpty(nextState)) {
            this.setState(nextState, function () {
                // Resize as needed after state is set
                if (_this._mountedComponent instanceof HTMLTextAreaElement) {
                    TextInput._updateScrollPositions(_this._mountedComponent, !!_this.state.autoResize);
                }
            });
        }
    };
    TextInput.prototype.componentDidMount = function () {
        if (this.props.placeholderTextColor) {
            TextInputPlaceholderSupport.addRef(this.props.placeholderTextColor);
        }
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    };
    TextInput.prototype.componentWillUnmount = function () {
        if (this.props.placeholderTextColor) {
            TextInputPlaceholderSupport.removeRef(this.props.placeholderTextColor);
        }
    };
    TextInput.prototype.render = function () {
        var _this = this;
        var combinedStyles = Styles_1.default.combine([_styles.defaultStyle, this.props.style]);
        // Always hide the outline.
        combinedStyles.outline = 'none';
        combinedStyles.resize = 'none';
        // Set the border to zero width if not otherwise specified.
        if (combinedStyles.borderWidth === undefined) {
            combinedStyles.borderWidth = 0;
        }
        // By default, the control is editable.
        var editable = (this.props.editable !== undefined ? this.props.editable : true);
        var spellCheck = (this.props.spellCheck !== undefined ? this.props.spellCheck : this.props.autoCorrect);
        var className = this.props.placeholderTextColor !== undefined ?
            TextInputPlaceholderSupport.getClassName(this.props.placeholderTextColor) : undefined;
        // Use a textarea for multi-line and a regular input for single-line.
        if (this.props.multiline) {
            return (React.createElement("textarea", { ref: this._onMount, style: combinedStyles, value: this.state.inputValue, title: this.props.title, tabIndex: this.props.tabIndex, autoCorrect: this.props.autoCorrect === false ? 'off' : undefined, spellCheck: spellCheck, disabled: !editable, maxLength: this.props.maxLength, placeholder: this.props.placeholder, className: className, onChange: this._onInputChanged, onKeyDown: this._onKeyDown, onKeyUp: this._checkSelectionChanged, onInput: this._onMultilineInput, onFocus: this._onFocus, onBlur: this._onBlur, onMouseDown: this._checkSelectionChanged, onMouseUp: this._checkSelectionChanged, onPaste: this._onPaste, onScroll: this._onScroll, "aria-label": this.props.accessibilityLabel || this.props.title, "data-test-id": this.props.testId }));
        }
        else {
            var _a = this._getKeyboardType(), keyboardTypeValue = _a.keyboardTypeValue, wrapInForm = _a.wrapInForm, pattern = _a.pattern;
            var input = (React.createElement("input", { ref: this._onMount, style: combinedStyles, value: this.state.inputValue, title: this.props.title, tabIndex: this.props.tabIndex, className: className, autoCapitalize: this.props.autoCapitalize, autoCorrect: this.props.autoCorrect === false ? 'off' : undefined, spellCheck: spellCheck, disabled: !editable, maxLength: this.props.maxLength, placeholder: this.props.placeholder, size: 1, onChange: this._onInputChanged, onKeyDown: this._onKeyDown, onKeyUp: this._checkSelectionChanged, onInput: this._onInput, onFocus: this._onFocus, onBlur: this._onBlur, onMouseDown: this._checkSelectionChanged, onMouseUp: this._checkSelectionChanged, onPaste: this._onPaste, "aria-label": this.props.accessibilityLabel || this.props.title, type: keyboardTypeValue, pattern: pattern, "data-test-id": this.props.testId }));
            if (wrapInForm) {
                // Wrap the input in a form tag if required
                input = (React.createElement("form", { action: '', onSubmit: function (ev) { /* prevent form submission/page reload */ ev.preventDefault(); _this.blur(); }, style: _styles.formStyle }, input));
            }
            return input;
        }
    };
    TextInput._shouldAutoResize = function (props) {
        // Single line boxes don't need auto-resize
        if (!props.multiline) {
            return false;
        }
        var combinedStyles = Styles_1.default.combine(props.style);
        if (!combinedStyles || typeof combinedStyles === 'number') {
            // Number-type styles aren't allowed on web but if they're found we can't decode them so assume not fixed height
            return true;
        }
        else if (Array.isArray(combinedStyles)) {
            // Iterate across the array and see if there's any height value
            // It's possible that the height could be set via another mechanism (like absolute positioning) which would potenailly
            // incorrectly engage the autoResize mode
            return combinedStyles.some(function (style) {
                if (!style || typeof style === 'number') {
                    return true;
                }
                return style.height === undefined;
            });
        }
        else {
            return combinedStyles.height === undefined;
        }
    };
    TextInput._updateScrollPositions = function (element, autoResize) {
        // If the height is fixed, there's nothing more to do
        if (!autoResize) {
            return;
        }
        // When scrolling we need to retain scroll tops of all elements
        var scrollTops = this._getParentElementAndTops(element);
        // Reset height to 1px so that we can detect shrinking TextInputs
        element.style.height = '1px';
        element.style.height = element.scrollHeight + 'px';
        scrollTops.forEach(function (obj) {
            obj.el.scrollTop = obj.top;
        });
    };
    TextInput._getParentElementAndTops = function (textAreaElement) {
        var element = textAreaElement;
        var results = [];
        while (element && element.parentElement) {
            element = element.parentElement;
            results.push({
                el: element,
                top: element.scrollTop,
            });
        }
        return results;
    };
    TextInput.prototype._getKeyboardType = function () {
        // Determine the correct virtual keyboardType in HTML 5.
        // Some types require the <input> tag to be wrapped in a form.
        // Pattern is used on numeric keyboardType to display numbers only.
        var keyboardTypeValue = 'text';
        var wrapInForm = false;
        var pattern;
        if (this.props.keyboardType === 'numeric') {
            pattern = '\\d*';
        }
        else if (this.props.keyboardType === 'number-pad') {
            keyboardTypeValue = 'tel';
        }
        else if (this.props.keyboardType === 'email-address') {
            keyboardTypeValue = 'email';
        }
        if (this.props.returnKeyType === 'search') {
            keyboardTypeValue = 'search';
            wrapInForm = true;
        }
        if (this.props.secureTextEntry) {
            keyboardTypeValue = 'password';
        }
        return { keyboardTypeValue: keyboardTypeValue, wrapInForm: wrapInForm, pattern: pattern };
    };
    TextInput.prototype.blur = function () {
        if (this._mountedComponent) {
            this._mountedComponent.blur();
        }
    };
    TextInput.prototype.requestFocus = function () {
        this._focus();
    };
    TextInput.prototype.focus = function () {
        if (this._mountedComponent) {
            this._mountedComponent.focus();
        }
    };
    TextInput.prototype.setAccessibilityFocus = function () {
        this._focus();
    };
    TextInput.prototype.isFocused = function () {
        if (this._mountedComponent) {
            return document.activeElement === this._mountedComponent;
        }
        return false;
    };
    TextInput.prototype.selectAll = function () {
        if (this._mountedComponent) {
            this._mountedComponent.select();
        }
    };
    TextInput.prototype.selectRange = function (start, end) {
        if (this._mountedComponent) {
            var component = this._mountedComponent;
            component.setSelectionRange(start, end);
        }
    };
    TextInput.prototype.getSelectionRange = function () {
        var range = {
            start: 0,
            end: 0,
        };
        if (this._mountedComponent) {
            range.start = this._mountedComponent.selectionStart || 0;
            range.end = this._mountedComponent.selectionEnd || 0;
        }
        return range;
    };
    TextInput.prototype.setValue = function (value) {
        var inputValue = value || '';
        if (this.state.inputValue !== inputValue) {
            // It's important to set the actual value in the DOM immediately. This allows us to call other related methods
            // like selectRange synchronously afterward.
            if (this._mountedComponent) {
                this._mountedComponent.value = inputValue;
            }
            this.setState({
                inputValue: inputValue,
            });
            if (this.props.onChangeText) {
                this.props.onChangeText(value);
            }
        }
    };
    TextInput.contextTypes = {
        focusArbitrator: PropTypes.object,
    };
    return TextInput;
}(React.Component));
exports.TextInput = TextInput;
FocusManager_1.applyFocusableComponentMixin(TextInput);
exports.default = TextInput;
