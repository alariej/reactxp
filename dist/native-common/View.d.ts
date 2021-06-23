/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform View abstraction.
*/
import * as React from 'react';
import * as RN from 'react-native';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import * as RX from '../common/Interfaces';
import ViewBase from './ViewBase';
export interface ViewContext {
    focusArbitrator?: FocusArbitratorProvider;
}
export declare class View extends ViewBase<RX.Types.ViewProps, RX.Types.Stateless, RN.View, RX.View> {
    static contextTypes: React.ValidationMap<any>;
    context: ViewContext;
    static childContextTypes: React.ValidationMap<any>;
    protected _internalProps: any;
    touchableGetInitialState: () => RN.Touchable.State;
    touchableHandleStartShouldSetResponder: () => boolean;
    touchableHandleResponderTerminationRequest: () => boolean;
    touchableHandleResponderGrant: (e: React.SyntheticEvent<any>) => void;
    touchableHandleResponderMove: (e: React.SyntheticEvent<any>) => void;
    touchableHandleResponderRelease: (e: React.SyntheticEvent<any>) => void;
    touchableHandleResponderTerminate: (e: React.SyntheticEvent<any>) => void;
    private _mixinIsApplied;
    private _childrenKeys;
    private _mixin_componentDidMount?;
    private _mixin_componentWillUnmount?;
    protected _isMounted: boolean;
    private _hideTimeout;
    private _defaultOpacityValue;
    private _opacityAnimatedValue;
    private _opacityAnimatedStyle;
    private _focusArbitratorProvider;
    constructor(props: RX.Types.ViewProps, context?: ViewContext);
    UNSAFE_componentWillReceiveProps(nextProps: RX.Types.ViewProps): void;
    UNSAFE_componentWillUpdate(nextProps: RX.Types.ViewProps, nextState: {}): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private _updateMixin;
    getChildContext(): ViewContext;
    /**
     * Attention:
     * be careful with setting any non layout properties unconditionally in this method to any value
     * as on android that would lead to extra layers of Views.
     */
    protected _buildInternalProps(props: RX.Types.ViewProps): void;
    private _onKeyPress;
    private _isTouchFeedbackApplicable;
    private _opacityActive;
    private _opacityInactive;
    private _getDefaultOpacityValue;
    private _setOpacityTo;
    private _showUnderlay;
    private _hideUnderlay;
    protected _isButton(viewProps: RX.Types.ViewProps): boolean;
    private _updateFocusArbitratorProvider;
    render(): JSX.Element;
    touchableHandlePress?(e: RX.Types.SyntheticEvent): void;
    touchableHandleLongPress?(e: RX.Types.SyntheticEvent): void;
    touchableHandleActivePressIn?(e: RX.Types.SyntheticEvent): void;
    touchableHandleActivePressOut?(e: RX.Types.SyntheticEvent): void;
    touchableGetHighlightDelayMS?(): number;
    touchableGetPressRectOffset?(): {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    setFocusRestricted(restricted: boolean): void;
    setFocusLimited(limited: boolean): void;
    blur(): void;
    requestFocus(): void;
    focus(): void;
}
export default View;
