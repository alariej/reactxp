/**
 * ViewBase.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Base class that is used for several RX views.
 */
/// <reference types="react" />
import * as RN from 'react-native';
import * as RX from '../common/Interfaces';
export declare abstract class ViewBase<P extends RX.Types.ViewPropsShared<C>, S, T extends RN.View | RN.ScrollView, C extends RX.View | RX.ScrollView> extends RX.ViewBase<P, S> {
    protected static readonly _supportsNativeFocusBlur: boolean;
    private static _defaultViewStyle;
    private _layoutEventValues;
    abstract render(): JSX.Element;
    protected _nativeComponent: T | undefined;
    static setDefaultViewStyle(defaultViewStyle: RX.Types.ViewStyleRuleSet): void;
    static getDefaultViewStyle(): RX.Types.ViewStyleRuleSet;
    setNativeProps(nativeProps: RN.ViewProps): void;
    protected _setNativeComponent: (view: T | null) => void;
    protected _getStyles(props: RX.Types.ViewProps): RX.Types.StyleRuleSetRecursive<RX.Types.ViewStyleRuleSet>;
    protected _onLayout: (event: RN.LayoutChangeEvent) => void;
}
export default ViewBase;
