/**
 * GestureView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Cross-platform parts of the implementation of the GestureView component.
 * It provides much of the standard work necessary to support combinations of
 * pinch-and-zoom, panning, single tap and double tap gestures.
 */
import * as React from 'react';
import { Types } from '../common/Interfaces';
export declare enum GestureType {
    None = 0,
    MultiTouch = 1,
    Pan = 2,
    PanVertical = 3,
    PanHorizontal = 4
}
export interface GestureStatePoint {
    /**
     * accumulated distance of the gesture since the touch started
     */
    dx: number;
    /**
     * accumulated distance of the gesture since the touch started
     */
    dy: number;
}
export interface GestureStatePointVelocity extends GestureStatePoint {
    /**
     * current velocity of the gesture
     */
    vx: number;
    /**
     * current velocity of the gesture
     */
    vy: number;
}
export interface TouchListBasic {
    [index: number]: Types.Touch;
    length: number;
}
export interface TouchEventBasic extends Types.SyntheticEvent {
    altKey: boolean;
    changedTouches: TouchListBasic;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    targetTouches: TouchListBasic;
    locationX?: number;
    locationY?: number;
    pageX?: number;
    pageY?: number;
    touches: TouchListBasic;
}
export declare abstract class GestureView extends React.Component<Types.GestureViewProps, Types.Stateless> {
    private _doubleTapTimer;
    private _pendingLongPressEvent;
    private _longPressTimer;
    private _pendingGestureType;
    private _pendingGestureState;
    private _lastTapEvent;
    private _shouldSkipNextTap;
    private _lastGestureStartEvent;
    componentWillUnmount(): void;
    protected _onTouchSeriesStart(event: TouchEventBasic): boolean;
    protected _onTouchChange(event: TouchEventBasic, gestureState: GestureStatePointVelocity): boolean;
    protected _onTouchSeriesFinished(touchEvent: TouchEventBasic, gestureState: GestureStatePointVelocity): void;
    protected abstract _getPreferredPanRatio(): number;
    protected abstract _getEventTimestamp(e: TouchEventBasic | Types.MouseEvent): number;
    protected _skipNextTap(): void;
    private _setPendingGestureState;
    private _detectMoveGesture;
    private _isTap;
    protected _isDoubleTap(e: Types.TapGestureState): boolean;
    protected _startDoubleTapTimer(e: Types.TapGestureState): void;
    protected _cancelDoubleTapTimer(): void;
    protected _startLongPressTimer(gsState: Types.TapGestureState, isDefinitelyMouse?: boolean): void;
    private _reportLongPress;
    protected _cancelLongPressTimer(): void;
    protected _reportDelayedTap(): void;
    protected _clearLastTap(): void;
    private static _isActuallyMouseEvent;
    private _shouldRespondToPinchZoom;
    private _shouldRespondToRotate;
    protected _shouldRespondToPan(gestureState: GestureStatePoint): boolean;
    protected _shouldRespondToPanVertical(gestureState: GestureStatePoint): boolean;
    protected _shouldRespondToPanHorizontal(gestureState: GestureStatePoint): boolean;
    private _calcDistance;
    private _calcAngle;
    private _radiansToDegrees;
    private _sendMultiTouchEvents;
    protected _touchEventToTapGestureState(e: TouchEventBasic): Types.TapGestureState;
    protected _mouseEventToTapGestureState(e: Types.MouseEvent): Types.TapGestureState;
    protected _getClientXYOffset(): {
        x: number;
        y: number;
    };
    private _sendPanEvent;
    private static _toMouseButton;
    protected _sendTapEvent: (tapEvent: Types.TapGestureState) => void;
    protected _sendDoubleTapEvent(e: Types.TapGestureState): void;
}
export default GestureView;
