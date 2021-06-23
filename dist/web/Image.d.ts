/**
 * Image.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Image abstraction.
 */
import * as React from 'react';
import { Types } from '../common/Interfaces';
export interface ImageState {
    showImgTag: boolean;
    xhrRequest: boolean;
    displayUrl: string;
}
export interface ImageContext {
    isRxParentAText?: boolean;
}
export declare class Image extends React.Component<Types.ImageProps, ImageState> {
    static contextTypes: React.ValidationMap<any>;
    context: ImageContext;
    static childContextTypes: React.ValidationMap<any>;
    private _mountedComponent;
    getChildContext(): {
        isRxParentAText: boolean;
    };
    static prefetch(url: string): Promise<boolean>;
    static getMetadata(url: string): Promise<Types.ImageMetadata>;
    private _isMounted;
    private _nativeImageWidth;
    private _nativeImageHeight;
    constructor(props: Types.ImageProps);
    UNSAFE_componentWillReceiveProps(nextProps: Types.ImageProps): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private _initializeAndSetState;
    private _handleXhrBlob;
    private _startXhrImageFetch;
    private _actuallyStartXhrImageFetch;
    render(): JSX.Element;
    protected _onMount: (component: HTMLImageElement | null) => void;
    private _getStyles;
    private _buildBackgroundSize;
    private _onLoad;
    private _imgOnError;
    private _onError;
    private _onMouseUp;
    getNativeWidth(): number | undefined;
    getNativeHeight(): number | undefined;
}
export default Image;
