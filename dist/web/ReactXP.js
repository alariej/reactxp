"use strict";
/**
* ReactXP.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Wrapper for all ReactXP functionality. Users of ReactXP should import just this
* file instead of internals.
*/
var React = require("react");
var AutoFocusHelper_1 = require("../common/utils/AutoFocusHelper");
var Location_1 = require("../common/Location");
var Popup_1 = require("../web/Popup");
var RXTypes = require("../common/Types");
var Accessibility_1 = require("./Accessibility");
var ActivityIndicator_1 = require("./ActivityIndicator");
var Alert_1 = require("./Alert");
var AnimatedImpl = require("./Animated");
var App_1 = require("./App");
var Button_1 = require("./Button");
var Clipboard_1 = require("./Clipboard");
var FocusManager_1 = require("./utils/FocusManager");
var GestureView_1 = require("./GestureView");
var Image_1 = require("./Image");
var Input_1 = require("./Input");
var International_1 = require("./International");
var Link_1 = require("./Link");
var Linking_1 = require("./Linking");
var Modal_1 = require("./Modal");
var Picker_1 = require("./Picker");
var Platform_1 = require("./Platform");
var ScrollView_1 = require("./ScrollView");
var StatusBar_1 = require("./StatusBar");
var Storage_1 = require("./Storage");
var Styles_1 = require("./Styles");
var Text_1 = require("./Text");
var TextInput_1 = require("./TextInput");
var UserInterface_1 = require("./UserInterface");
var UserPresence_1 = require("./UserPresence");
var View_1 = require("./View");
var ViewBase_1 = require("./ViewBase");
(0, AutoFocusHelper_1.setSortAndFilterFunc)(FocusManager_1.default.sortAndFilterAutoFocusCandidates);
// -- STRANGE THINGS GOING ON HERE --
//
// 1) 'export type Foo = FooImpl; export var Foo = FooImpl;'
//    If the var 'Foo' was exported alone then the name 'RX.Foo' would not be valid in a type position: 'function takesFoo(foo: RX.Foo)'.
//    To avoid this problem, the type information is also exported. TypeScript will merge the var and type together (if the types match).
var ReactXP;
(function (ReactXP) {
    ReactXP.Accessibility = Accessibility_1.default;
    ReactXP.ActivityIndicator = ActivityIndicator_1.ActivityIndicator;
    ReactXP.Alert = Alert_1.default;
    ReactXP.App = App_1.default;
    ReactXP.Button = Button_1.Button;
    ReactXP.Picker = Picker_1.Picker;
    ReactXP.Clipboard = Clipboard_1.default;
    ReactXP.GestureView = GestureView_1.GestureView;
    ReactXP.Image = Image_1.Image;
    ReactXP.Input = Input_1.default;
    ReactXP.International = International_1.default;
    ReactXP.Link = Link_1.Link;
    ReactXP.Linking = Linking_1.default;
    ReactXP.Location = Location_1.default;
    ReactXP.Modal = Modal_1.default;
    ReactXP.Platform = Platform_1.default;
    ReactXP.Popup = Popup_1.default;
    ReactXP.ScrollView = ScrollView_1.ScrollView;
    ReactXP.StatusBar = StatusBar_1.default;
    ReactXP.Storage = Storage_1.default;
    ReactXP.Styles = Styles_1.default;
    ReactXP.Text = Text_1.Text;
    ReactXP.TextInput = TextInput_1.TextInput;
    ReactXP.UserInterface = UserInterface_1.default;
    ReactXP.UserPresence = UserPresence_1.default;
    ReactXP.View = View_1.default;
    ReactXP.Animated = AnimatedImpl;
    ReactXP.Types = RXTypes;
    ReactXP.Component = React.Component;
    ReactXP.createElement = React.createElement;
    ReactXP.Children = React.Children;
    ReactXP.__spread = React.__spread;
    ReactXP.Fragment = React.Fragment;
})(ReactXP || (ReactXP = {}));
ViewBase_1.ViewBase.setActivationState(App_1.default.getActivationState());
App_1.default.activationStateChangedEvent.subscribe(function (newState) {
    ViewBase_1.ViewBase.setActivationState(newState);
});
// -- STRANGE THINGS GOING ON HERE --
//
// 1) Unused variable
//    This forces TypeScript to type-check the above RX module against the common RX interface. Missing/incorrect types will cause errors.
//    Note: RX must be a module so 'RX.Foo' can be a valid value ('new RX.Foo') and valid type ('var k: RX.Foo'), but modules cannot
//    implement an interface. If RX was a class or variable then it could directly check this, but then 'RX.Foo' would not be a valid type.
var _rxImplementsRxInterface = ReactXP;
_rxImplementsRxInterface = _rxImplementsRxInterface;
module.exports = ReactXP;
/*

var rx = module.exports;
Object.keys(rx)
    .filter(key => rx[key] && rx[key].prototype instanceof React.Component && !rx[key].displayName)
    .forEach(key => rx[key].displayName = 'RX.' + key + '');
*/
