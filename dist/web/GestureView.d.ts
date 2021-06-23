/**
 * GestureView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform GestureView component.
 * It provides support for the scroll wheel, clicks and double clicks.
 */
import * as React from 'react';
import GestureViewCommon from '../common/GestureView';
import { Types } from '../common/Interfaces';
export interface GestureViewContext {
    isInRxMainView?: boolean;
}
export declare abstract class GestureView extends GestureViewCommon {
    private _id;
    private _isMounted;
    private _container;
    private _initialTouch;
    private _ongoingGesture;
    private _responder;
    private _pendingMouseGestureType;
    private _gestureTypeLocked;
    static contextTypes: React.ValidationMap<any>;
    protected _getPreferredPanRatio(): number;
    protected _getEventTimestamp(e: Types.TouchEvent | Types.MouseEvent): number;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    blur(): void;
    focus(): void;
    protected _getContainer(): HTMLElement | null;
    private _createMouseResponder;
    private _disposeMouseResponder;
    private _setContainerRef;
    private _getStyles;
    private _onMouseDown;
    private _onClick;
    private _sendContextMenuEvent;
    private static _reactTouchEventToBasic;
    private static _mapReactTouchListToBasic;
    private static _mapReactTouchToRx;
    private _onTouchStart;
    private _onTouchMove;
    private _onTouchEnd;
    private _detectGestureType;
    private _onWheel;
    private _sendMousePanEvent;
    protected _getClientXYOffset(): {
        x: number;
        y: number;
    };
    private _getGestureViewClientRect;
}
export default GestureView;
