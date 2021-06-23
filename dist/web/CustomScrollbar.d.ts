/**
 * CustomScrollbar.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Custom scrollbar implementation for web.
 */
export interface ScrollbarOptions {
    horizontal?: boolean;
    vertical?: boolean;
    hiddenScrollbar?: boolean;
}
export declare class Scrollbar {
    private _container;
    private _verticalBar;
    private _horizontalBar;
    private _viewport;
    private _dragging;
    private _dragIsVertical;
    private _scrollingVisible;
    private _hasHorizontal;
    private _hasVertical;
    private _hasHiddenScrollbar;
    private _stopDragCallback;
    private _startDragVCallback;
    private _startDragHCallback;
    private _handleDragCallback;
    private _handleWheelCallback;
    private _handleMouseDownCallback;
    private _updateCallback;
    private _asyncInitTimer;
    static getNativeScrollbarWidth(): number;
    private static _installStyleSheet;
    constructor(container: HTMLElement);
    private _tryLtrOverride;
    private _prevent;
    private _updateSliders;
    private _handleDrag;
    private _startDrag;
    private _stopDrag;
    private _handleWheel;
    private _handleMouseDown;
    private _normalizeDelta;
    private _addListeners;
    private _removeListeners;
    private _createDivWithClass;
    private _addScrollBar;
    private _addScrollbars;
    private _removeScrollbars;
    private _calcNewBarSize;
    private _resize;
    update(): void;
    show(): void;
    hide(): void;
    init(options?: ScrollbarOptions): void;
    dispose(): void;
}
export default Scrollbar;
