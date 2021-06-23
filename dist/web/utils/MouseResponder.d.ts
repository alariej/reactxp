/**
 * MouseResponder.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Handles tracking of mouse movements.
 */
import { Types } from '../../common/Interfaces';
export interface MouseResponderConfig {
    id: number;
    target: HTMLElement;
    disableWhenModal: boolean;
    shouldBecomeFirstResponder?: (event: MouseEvent, gestureState: Types.PanGestureState) => boolean;
    onMove?: (event: MouseEvent, gestureState: Types.PanGestureState) => void;
    onTerminate?: (event: MouseEvent, gestureState: Types.PanGestureState) => void;
}
export interface MouseResponderSubscription {
    dispose(): void;
}
export default class MouseResponder {
    private static _currentResponder;
    private static _pendingGestureState;
    private static _initialized;
    private static _isModalDisplayed;
    private static _responders;
    static setModalIsDisplayed(isDisplayed: boolean): void;
    static create(config: MouseResponderConfig): MouseResponderSubscription;
    private static _initializeEventHandlers;
    private static _removeEventHandlers;
    private static _onMouseDown;
    private static _onMouseMove;
    private static _onMouseUp;
    private static _calcVelocity;
}
