/**
 * UserInterface.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN implementation of the ReactXP interfaces related to
 * UI (layout measurements, etc.).
 */
import * as React from 'react';
import * as RN from 'react-native';
import * as RX from '../common/Interfaces';
export declare class UserInterface extends RX.UserInterface {
    private _touchLatencyThresholhdMs;
    private _isNavigatingWithKeyboard;
    private _rootViewUsingPropsFactory;
    private _rootViewRegistry;
    constructor();
    measureLayoutRelativeToWindow(component: React.Component<any, any>): Promise<RX.Types.LayoutInfo>;
    measureLayoutRelativeToAncestor(component: React.Component<any, any>, ancestor: React.Component<any, any>): Promise<RX.Types.LayoutInfo>;
    measureWindow(rootViewId?: string): RX.Types.LayoutInfo;
    getContentSizeMultiplier(): Promise<number>;
    useCustomScrollbars(enable?: boolean): void;
    dismissKeyboard(): void;
    isHighPixelDensityScreen(): boolean;
    getPixelRatio(): number;
    setMainView(element: React.ReactElement<any>): void;
    registerRootViewUsingPropsFactory(factory: RN.ComponentProvider): void;
    registerRootView(viewKey: string, getComponentFunc: Function): void;
    renderMainView(): void;
    enableTouchLatencyEvents(latencyThresholdMs: number): void;
    evaluateTouchLatency(e: RX.Types.SyntheticEvent): void;
    isNavigatingWithKeyboard(): boolean;
    private _keyboardNavigationStateChanged;
    notifyRootViewInstanceCreated(rootViewId: string, nodeHandle: number): void;
    notifyRootViewInstanceDestroyed(rootViewId: string): void;
    findNodeHandleByRootViewId(rootViewId: string): number | undefined;
}
declare const _default: UserInterface;
export default _default;
