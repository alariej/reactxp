/**
 * ScrollView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Windows/OSX-specific implementation of the cross-platform ScrollView abstraction.
 */
import * as React from 'react';
import * as RN from 'react-native';
import { ScrollView as ScrollViewBase } from '../native-common/ScrollView';
declare type ScrollViewProps = RN.ScrollViewProps & React.Props<RN.ScrollView>;
export declare class ScrollView extends ScrollViewBase {
    protected _render(nativeProps: ScrollViewProps): JSX.Element;
    private _onKeyDown;
}
export default ScrollView;
