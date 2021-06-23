/**
 * ViewBase.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * A base class for the Web-specific implementation of the cross-platform View abstraction.
 */
/// <reference types="react" />
import * as RX from '../common/Interfaces';
export declare abstract class ViewBase<P extends RX.Types.ViewPropsShared<C>, S, C extends RX.View | RX.ScrollView> extends RX.ViewBase<P, S> {
    private static _viewCheckingTimer;
    private static _isResizeHandlerInstalled;
    private static _viewCheckingList;
    private static _appActivationState;
    abstract render(): JSX.Element;
    protected abstract _getContainer(): HTMLElement | null;
    protected _isMounted: boolean;
    private _isPopupDisplayed;
    static setActivationState(newState: RX.Types.AppActivationState): void;
    UNSAFE_componentWillReceiveProps(nextProps: RX.Types.ViewPropsShared<C>): void;
    protected static _checkViews(): void;
    private static _layoutReportList;
    private static _layoutReportingTimer;
    private static _reportLayoutChange;
    protected static _reportDeferredLayoutChanges(): void;
    protected _lastX: number;
    protected _lastY: number;
    protected _lastWidth: number;
    protected _lastHeight: number;
    protected _checkAndReportLayout(): Promise<void>;
    private _checkViewCheckerBuild;
    private _checkViewCheckerUnbuild;
    componentDidMount(): void;
    componentDidUpdate(): void;
    private static _onResize;
    componentWillUnmount(): void;
}
export default ViewBase;
