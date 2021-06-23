/**
 * View.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform View abstraction.
 */
import * as React from 'react';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import * as RX from '../common/Interfaces';
import { FocusManager } from './utils/FocusManager';
import PopupContainerView from './PopupContainerView';
import ViewBase from './ViewBase';
export interface ViewContext {
    isRxParentAText?: boolean;
    focusManager?: FocusManager;
    popupContainer?: PopupContainerView;
    focusArbitrator?: FocusArbitratorProvider;
}
export declare class View extends ViewBase<RX.Types.ViewProps, RX.Types.Stateless, RX.View> {
    static contextTypes: React.ValidationMap<any>;
    context: ViewContext;
    static childContextTypes: React.ValidationMap<any>;
    private _focusManager;
    private _limitFocusWithin;
    private _isFocusLimited;
    private _isFocusRestricted;
    private _focusArbitratorProvider;
    private _resizeDetectorAnimationFrame;
    private _resizeDetectorNodes;
    private _popupContainer;
    private _popupToken;
    constructor(props: RX.Types.ViewProps, context?: ViewContext);
    private _renderResizeDetectorIfNeeded;
    private _onResizeDetectorGrowRef;
    private _onResizeDetectorShrinkRef;
    private _resizeDetectorReset;
    private _resizeDetectorOnScroll;
    getChildContext(): ViewContext;
    protected _getContainer(): HTMLElement | null;
    private _isHidden;
    private _updateFocusArbitratorProvider;
    setFocusRestricted(restricted: boolean): void;
    setFocusLimited(limited: boolean): void;
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    UNSAFE_componentWillReceiveProps(nextProps: RX.Types.ViewProps): void;
    enableFocusManager(): void;
    disableFocusManager(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    blur(): void;
    requestFocus(): void;
    focus(): void;
}
export default View;
