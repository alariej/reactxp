/**
 * GestureView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform GestureView component.
 * It provides much of the standard work necessary to support combinations of
 * pinch-and-zoom, panning, single tap and double tap gestures.
 */
/// <reference types="react" />
import GestureViewCommon from '../common/GestureView';
import { Types } from '../common/Interfaces';
export declare abstract class GestureView extends GestureViewCommon {
    private _panResponder;
    private _view;
    constructor(props: Types.GestureViewProps);
    render(): JSX.Element;
    protected _macos_sendTapEvent: (e: Types.MouseEvent) => void;
    private _onRef;
    private _onKeyPress;
    focus(): void;
    blur(): void;
}
export default GestureView;
