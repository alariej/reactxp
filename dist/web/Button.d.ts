/**
 * Button.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Button abstraction.
 */
/// <reference types="react" />
import * as PropTypes from 'prop-types';
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
    static childContextTypes: {
        hasRxButtonAscendant: PropTypes.Requireable<any> & PropTypes.Validator<any>;
    };
    private _mountedButton;
    private _lastMouseDownEvent;
    private _ignoreTouchEnd;
    private _ignoreClick;
    private _longPressTimer;
    private _isMouseOver;
    private _isFocusedWithKeyboard;
    private _isHoverStarted;
    constructor(props: Types.ButtonProps, context?: ButtonContext);
    getChildContext(): ButtonContext;
    render(): JSX.Element;
    componentDidMount(): void;
    requestFocus(): void;
    focus(): void;
    blur(): void;
    private _onMount;
    protected onClick: (e: Types.MouseEvent) => void;
    private _getStyles;
    private _onContextMenu;
    private _onMouseDown;
    private _onTouchMove;
    private _onMouseUp;
    /**
     * Case where onPressOut is not triggered and the bubbling is canceled:
     * 1- Long press > release
     *
     * Cases where onPressOut is triggered:
     * 2- Long press > leave button > release touch
     * 3- Tap
     *
     * All other cases: onPressOut is not triggered and the bubbling is NOT canceled:
     */
    private _onTouchEnd;
    private _onMouseEnter;
    private _onMouseLeave;
    private _onFocus;
    private _onBlur;
    private _onHoverStart;
    private _onHoverEnd;
}
export default Button;
