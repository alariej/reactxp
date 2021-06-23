/**
 * UserInterface.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the ReactXP interfaces related to
 * UI (layout measurements, etc.).
 */
import * as React from 'react';
import * as RX from '../common/Interfaces';
export declare class UserInterface extends RX.UserInterface {
    private _isNavigatingWithKeyboard;
    constructor();
    measureLayoutRelativeToWindow(component: React.Component<any, any>): Promise<RX.Types.LayoutInfo>;
    measureLayoutRelativeToAncestor(component: React.Component<any, any>, ancestor: React.Component<any, any>): Promise<RX.Types.LayoutInfo>;
    measureWindow(rootViewId?: string): RX.Types.LayoutInfo;
    getContentSizeMultiplier(): Promise<number>;
    isHighPixelDensityScreen(): boolean;
    getPixelRatio(): number;
    setMainView(element: React.ReactElement<any>): void;
    registerRootView(viewKey: string, getComponentFunc: Function): void;
    useCustomScrollbars(enable?: boolean): void;
    dismissKeyboard(): void;
    enableTouchLatencyEvents(latencyThresholdMs: number): void;
    evaluateTouchLatency(e: RX.Types.MouseEvent): void;
    isNavigatingWithKeyboard(): boolean;
    private _keyboardNavigationStateChanged;
}
declare const _default: UserInterface;
export default _default;
