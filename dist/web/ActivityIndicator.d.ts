/**
 * ActivityIndicator.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Control to display an animated activity indicator.
 */
import * as React from 'react';
import { Types } from '../common/Interfaces';
export interface ActivityIndicatorState {
    isVisible?: boolean;
}
export declare class ActivityIndicator extends React.Component<Types.ActivityIndicatorProps, ActivityIndicatorState> {
    private static _isStyleSheetInstalled;
    private _isMounted;
    private static _installStyleSheet;
    constructor(props: Types.ActivityIndicatorProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export default ActivityIndicator;
