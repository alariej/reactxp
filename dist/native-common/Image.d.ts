/**
 * Image.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Image abstraction.
 */
import * as React from 'react';
import * as RN from 'react-native';
import { Types } from '../common/Interfaces';
export interface ImageContext {
    isRxParentAText?: boolean;
}
export interface ImageState {
    forceCache?: boolean;
    lastNativeError?: any;
    headers?: Types.Headers;
}
export declare class Image extends React.Component<Types.ImageProps, ImageState> implements React.ChildContextProvider<ImageContext> {
    static childContextTypes: React.ValidationMap<any>;
    static prefetch(url: string): Promise<boolean>;
    static getMetadata(url: string): Promise<Types.ImageMetadata>;
    protected _mountedComponent: RN.Image | undefined;
    private _nativeImageWidth;
    private _nativeImageHeight;
    readonly state: ImageState;
    protected _getAdditionalProps(): RN.ImageProperties | {};
    render(): JSX.Element;
    UNSAFE_componentWillReceiveProps(nextProps: Types.ImageProps): void;
    protected _onMount: (component: RN.Image | null) => void;
    setNativeProps(nativeProps: RN.ImageProps): void;
    getChildContext(): {
        isRxParentAText: boolean;
    };
    protected getStyles(): (number | Types.ImageStyle | Types.StyleRuleSetRecursiveArray<Types.ImageStyleRuleSet> | undefined)[];
    private _buildResizeMode;
    private _onLoad;
    private _onError;
    private static _maybeOverrideHeaders;
    private _buildSource;
    private static _getMaxStaleHeader;
    getNativeWidth(): number | undefined;
    getNativeHeight(): number | undefined;
}
export default Image;
