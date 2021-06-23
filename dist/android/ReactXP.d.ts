/**
* ReactXP.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Wrapper for all ReactXP functionality. Users of ReactXP should import just this
* file instead of internals.
*/
import React = require('react');
import RXInterfaces = require('../common/Interfaces');
import RXTypes = require('../common/Types');
declare module ReactXP {
    type Accessibility = RXInterfaces.Accessibility;
    let Accessibility: RXInterfaces.Accessibility;
    type ActivityIndicator = RXInterfaces.ActivityIndicator;
    let ActivityIndicator: typeof RXInterfaces.ActivityIndicator;
    type Alert = RXInterfaces.Alert;
    let Alert: RXInterfaces.Alert;
    type App = RXInterfaces.App;
    let App: RXInterfaces.App;
    type Button = RXInterfaces.Button;
    let Button: typeof RXInterfaces.Button;
    type Picker = RXInterfaces.Picker;
    let Picker: typeof RXInterfaces.Picker;
    type Clipboard = RXInterfaces.Clipboard;
    let Clipboard: RXInterfaces.Clipboard;
    type GestureView = RXInterfaces.GestureView;
    let GestureView: typeof RXInterfaces.GestureView;
    type Image = RXInterfaces.Image;
    let Image: RXInterfaces.ImageConstructor;
    type Input = RXInterfaces.Input;
    let Input: RXInterfaces.Input;
    type International = RXInterfaces.International;
    let International: RXInterfaces.International;
    type Link = RXInterfaces.Link;
    let Link: typeof RXInterfaces.Link;
    type Linking = RXInterfaces.Linking;
    let Linking: RXInterfaces.Linking;
    type Location = RXInterfaces.Location;
    let Location: RXInterfaces.Location;
    type Modal = RXInterfaces.Modal;
    let Modal: RXInterfaces.Modal;
    type Platform = RXInterfaces.Platform;
    let Platform: RXInterfaces.Platform;
    type Popup = RXInterfaces.Popup;
    let Popup: RXInterfaces.Popup;
    type ScrollView = RXInterfaces.ScrollView;
    let ScrollView: RXInterfaces.ScrollViewConstructor;
    type StatusBar = RXInterfaces.StatusBar;
    let StatusBar: RXInterfaces.StatusBar;
    type Storage = RXInterfaces.Storage;
    let Storage: RXInterfaces.Storage;
    type Styles = RXInterfaces.Styles;
    let Styles: RXInterfaces.Styles;
    type Text = RXInterfaces.Text;
    let Text: typeof RXInterfaces.Text;
    type TextInput = RXInterfaces.TextInput;
    let TextInput: typeof RXInterfaces.TextInput;
    type UserInterface = RXInterfaces.UserInterface;
    let UserInterface: RXInterfaces.UserInterface;
    type UserPresence = RXInterfaces.UserPresence;
    let UserPresence: RXInterfaces.UserPresence;
    type View = RXInterfaces.View;
    let View: typeof RXInterfaces.View;
    const Animated: RXInterfaces.Animated;
    export import CommonProps = RXTypes.CommonProps;
    export import CommonStyledProps = RXTypes.CommonStyledProps;
    export import Stateless = RXTypes.Stateless;
    export import Types = RXTypes;
    export import Component = React.Component;
    export import ComponentBase = RXTypes.ComponentBase;
    export import createElement = React.createElement;
    export import Children = React.Children;
    let __spread: any;
    export import Fragment = React.Fragment;
}
export = ReactXP;
