"use strict";
/**
 * Interfaces.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Defines the template for the ReactXP interface that needs to be
 * implemented for each platform.
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
exports.GestureView = exports.View = exports.ViewBase = exports.UserPresence = exports.TextInput = exports.Text = exports.Styles = exports.StatusBar = exports.Input = exports.Platform = exports.Location = exports.Link = exports.Clipboard = exports.Image = exports.Component = exports.Picker = exports.Button = exports.Accessibility = exports.Linking = exports.Popup = exports.Modal = exports.UserInterface = exports.App = exports.AnimatedView = exports.AnimatedTextInput = exports.AnimatedText = exports.AnimatedImage = exports.AnimatedComponent = exports.Alert = exports.ActivityIndicator = exports.Types = void 0;
var React = require("react");
var subscribableevent_1 = require("subscribableevent");
var AppConfig_1 = require("./AppConfig");
var Types = require("./Types");
exports.Types = Types;
var ActivityIndicator = /** @class */ (function (_super) {
    __extends(ActivityIndicator, _super);
    function ActivityIndicator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ActivityIndicator;
}(React.Component));
exports.ActivityIndicator = ActivityIndicator;
var Alert = /** @class */ (function () {
    function Alert() {
    }
    return Alert;
}());
exports.Alert = Alert;
var AnimatedComponent = /** @class */ (function (_super) {
    __extends(AnimatedComponent, _super);
    function AnimatedComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AnimatedComponent;
}(React.Component));
exports.AnimatedComponent = AnimatedComponent;
var AnimatedImage = /** @class */ (function (_super) {
    __extends(AnimatedImage, _super);
    function AnimatedImage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AnimatedImage;
}(AnimatedComponent));
exports.AnimatedImage = AnimatedImage;
var AnimatedText = /** @class */ (function (_super) {
    __extends(AnimatedText, _super);
    function AnimatedText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AnimatedText;
}(AnimatedComponent));
exports.AnimatedText = AnimatedText;
var AnimatedTextInput = /** @class */ (function (_super) {
    __extends(AnimatedTextInput, _super);
    function AnimatedTextInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AnimatedTextInput;
}(AnimatedComponent));
exports.AnimatedTextInput = AnimatedTextInput;
var AnimatedView = /** @class */ (function (_super) {
    __extends(AnimatedView, _super);
    function AnimatedView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AnimatedView;
}(AnimatedComponent));
exports.AnimatedView = AnimatedView;
var App = /** @class */ (function () {
    function App() {
        this.supportsExperimentalKeyboardNavigation = false;
        this.activationStateChangedEvent = new subscribableevent_1.default();
        // Memory Warnings
        this.memoryWarningEvent = new subscribableevent_1.default();
    }
    // Initialization
    App.prototype.initialize = function (debug, development) {
        AppConfig_1.default.setAppConfig(debug, development);
    };
    return App;
}());
exports.App = App;
var UserInterface = /** @class */ (function () {
    function UserInterface() {
        this.contentSizeMultiplierChangedEvent = new subscribableevent_1.default();
        this.touchLatencyEvent = new subscribableevent_1.default();
        this.keyboardNavigationEvent = new subscribableevent_1.default();
    }
    return UserInterface;
}());
exports.UserInterface = UserInterface;
var Modal = /** @class */ (function () {
    function Modal() {
    }
    return Modal;
}());
exports.Modal = Modal;
var Popup = /** @class */ (function () {
    function Popup() {
    }
    return Popup;
}());
exports.Popup = Popup;
var Linking = /** @class */ (function () {
    function Linking() {
        this.deepLinkRequestEvent = new subscribableevent_1.default();
    }
    return Linking;
}());
exports.Linking = Linking;
var Accessibility = /** @class */ (function () {
    function Accessibility() {
        this.screenReaderChangedEvent = new subscribableevent_1.default();
        this.highContrastChangedEvent = new subscribableevent_1.default();
    }
    return Accessibility;
}());
exports.Accessibility = Accessibility;
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Button;
}(React.Component));
exports.Button = Button;
var Picker = /** @class */ (function (_super) {
    __extends(Picker, _super);
    function Picker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Picker;
}(React.Component));
exports.Picker = Picker;
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Component;
}(React.Component));
exports.Component = Component;
var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    function Image() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Image;
}(React.Component));
exports.Image = Image;
var Clipboard = /** @class */ (function () {
    function Clipboard() {
    }
    return Clipboard;
}());
exports.Clipboard = Clipboard;
var Link = /** @class */ (function (_super) {
    __extends(Link, _super);
    function Link() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Link;
}(React.Component));
exports.Link = Link;
var Location = /** @class */ (function () {
    function Location() {
    }
    return Location;
}());
exports.Location = Location;
var Platform = /** @class */ (function () {
    function Platform() {
    }
    return Platform;
}());
exports.Platform = Platform;
var Input = /** @class */ (function () {
    function Input() {
        this.backButtonEvent = new subscribableevent_1.default(true);
        this.keyDownEvent = new subscribableevent_1.default(true);
        this.keyUpEvent = new subscribableevent_1.default(true);
    }
    return Input;
}());
exports.Input = Input;
var StatusBar = /** @class */ (function () {
    function StatusBar() {
    }
    return StatusBar;
}());
exports.StatusBar = StatusBar;
var Styles = /** @class */ (function () {
    function Styles() {
    }
    return Styles;
}());
exports.Styles = Styles;
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Text;
}(React.Component));
exports.Text = Text;
var TextInput = /** @class */ (function (_super) {
    __extends(TextInput, _super);
    function TextInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TextInput;
}(React.Component));
exports.TextInput = TextInput;
var UserPresence = /** @class */ (function () {
    function UserPresence() {
        this.userPresenceChangedEvent = new subscribableevent_1.default();
    }
    return UserPresence;
}());
exports.UserPresence = UserPresence;
var ViewBase = /** @class */ (function (_super) {
    __extends(ViewBase, _super);
    function ViewBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ViewBase;
}(React.Component));
exports.ViewBase = ViewBase;
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return View;
}(ViewBase));
exports.View = View;
var GestureView = /** @class */ (function (_super) {
    __extends(GestureView, _super);
    function GestureView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GestureView;
}(ViewBase));
exports.GestureView = GestureView;
