/**
 * ModuleInterface.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Defines a common base module type information set for all platforms to implement.
 */
import * as React from 'react';
import * as RX from './Interfaces';
export declare module ReactXP {
    type Accessibility = RX.Accessibility;
    let Accessibility: RX.Accessibility;
    type ActivityIndicator = RX.ActivityIndicator;
    let ActivityIndicator: typeof RX.ActivityIndicator;
    type Alert = RX.Alert;
    let Alert: RX.Alert;
    type App = RX.App;
    let App: RX.App;
    type Button = RX.Button;
    let Button: typeof RX.Button;
    type Picker = RX.Picker;
    let Picker: typeof RX.Picker;
    type Clipboard = RX.Clipboard;
    let Clipboard: RX.Clipboard;
    type GestureView = RX.GestureView;
    let GestureView: typeof RX.GestureView;
    type Image = RX.Image;
    let Image: RX.ImageConstructor;
    type Input = RX.Input;
    let Input: RX.Input;
    type International = RX.International;
    let International: RX.International;
    type Link = RX.Link;
    let Link: typeof RX.Link;
    type Linking = RX.Linking;
    let Linking: RX.Linking;
    type Location = RX.Location;
    let Location: RX.Location;
    type Modal = RX.Modal;
    let Modal: RX.Modal;
    type Platform = RX.Platform;
    let Platform: RX.Platform;
    type Popup = RX.Popup;
    let Popup: RX.Popup;
    type ScrollView = RX.ScrollView;
    let ScrollView: RX.ScrollViewConstructor;
    type StatusBar = RX.StatusBar;
    let StatusBar: RX.StatusBar;
    type Storage = RX.Storage;
    let Storage: RX.Storage;
    type Styles = RX.Styles;
    let Styles: RX.Styles;
    type Text = RX.Text;
    let Text: typeof RX.Text;
    type TextInput = RX.TextInput;
    let TextInput: typeof RX.TextInput;
    type UserInterface = RX.UserInterface;
    let UserInterface: RX.UserInterface;
    type UserPresence = RX.UserPresence;
    let UserPresence: RX.UserPresence;
    type View = RX.View;
    let View: typeof RX.View;
    type Animated = RX.Animated;
    let Animated: RX.Animated;
    export import CommonProps = RX.Types.CommonProps;
    export import CommonStyledProps = RX.Types.CommonStyledProps;
    export import Types = RX.Types;
    export import Component = React.Component;
    let createElement: typeof React.createElement;
    let Children: typeof React.Children;
    let __spread: any;
}
