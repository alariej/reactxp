/**
 * Button.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Button abstraction.
 */
import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as RN from 'react-native';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import { Button as ButtonBase, Types } from '../common/Interfaces';
export interface ButtonContext {
    hasRxButtonAscendant?: boolean;
    focusArbitrator?: FocusArbitratorProvider;
}
export declare class Button extends ButtonBase {
    static contextTypes: {
        hasRxButtonAscendant: PropTypes.Requireable<any> & PropTypes.Validator<any>;
        focusArbitrator: PropTypes.Requireable<any> & PropTypes.Validator<any>;
    };
    context: ButtonContext;
    static childContextTypes: React.ValidationMap<any>;
    private _mixin_componentDidMount;
    private _mixin_componentWillUnmount;
    touchableGetInitialState: () => RN.Touchable.State;
    touchableHandleStartShouldSetResponder: () => boolean;
    touchableHandleResponderTerminationRequest: () => boolean;
    touchableHandleResponderGrant: (e: RN.GestureResponderEvent) => void;
    touchableHandleResponderMove: (e: RN.GestureResponderEvent) => void;
    touchableHandleResponderRelease: (e: RN.GestureResponderEvent) => void;
    touchableHandleResponderTerminate: (e: RN.GestureResponderEvent) => void;
    protected _isMounted: boolean;
    protected _isMouseOver: boolean;
    protected _isHoverStarted: boolean;
    protected _buttonElement: RN.View | undefined;
    private _hideTimeout;
    private _defaultOpacityValue;
    private _opacityAnimatedValue;
    private _opacityAnimatedStyle;
    constructor(props: Types.ButtonProps, context?: ButtonContext);
    protected _render(internalProps: RN.ViewProps, onMount: (btn: RN.View | null) => void): JSX.Element;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: Types.ButtonProps): void;
    getChildContext(): ButtonContext;
    setNativeProps(nativeProps: RN.ViewProps): void;
    touchableHandleActivePressIn: (e: Types.SyntheticEvent) => void;
    touchableHandleActivePressOut: (e: Types.SyntheticEvent) => void;
    touchableHandlePress: (e: Types.SyntheticEvent) => void;
    touchableHandleLongPress: (e: Types.SyntheticEvent) => void;
    touchableGetHighlightDelayMS: () => number;
    touchableGetPressRectOffset: () => {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    requestFocus(): void;
    blur(): void;
    focus(): void;
    private _setOpacityStyles;
    private _onMount;
    private _isTouchFeedbackApplicable;
    private _opacityActive;
    private _opacityInactive;
    private _getDefaultOpacityValue;
    protected _onMouseEnter: (e: Types.SyntheticEvent) => void;
    protected _onMouseLeave: (e: Types.SyntheticEvent) => void;
    protected _onHoverStart: (e: Types.SyntheticEvent) => void;
    protected _onHoverEnd: (e: Types.SyntheticEvent) => void;
    /**
    * Animate the touchable to a new opacity.
    */
    setOpacityTo(value: number, duration: number): void;
    private _hasPressHandler;
    private _showUnderlay;
    private _hideUnderlay;
}
export default Button;
