/**
 * ScrollView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform ScrollView abstraction.
 */
/// <reference types="react" />
import * as RX from '../common/Interfaces';
import ViewBase from './ViewBase';
export declare class ScrollView extends ViewBase<RX.Types.ScrollViewProps, RX.Types.Stateless, RX.ScrollView> implements RX.ScrollView {
    private _mountedComponent;
    constructor(props: RX.Types.ScrollViewProps);
    private _mounted;
    private _customScrollbar;
    private _customScrollbarEnabled;
    private _dragging;
    componentDidUpdate(): void;
    render(): JSX.Element;
    UNSAFE_componentWillMount(): void;
    componentDidMount(): void;
    UNSAFE_componentWillReceiveProps(newProps: RX.Types.ScrollViewProps): void;
    componentWillUnmount(): void;
    protected _getContainer(): HTMLElement | null;
    private _onScroll;
    private _onPropsChange;
    private _createCustomScrollbarsIfNeeded;
    private _getContainerStyle;
    private _renderNormal;
    private _renderWithCustomScrollbar;
    protected _onMount: (component: HTMLElement | null) => void;
    setScrollTop(scrollTop: number, animate?: boolean): void;
    setScrollLeft(scrollLeft: number, animate?: boolean): void;
    private _easeInOut;
    private _onTouchStart;
    private _onTouchEnd;
}
export default ScrollView;
