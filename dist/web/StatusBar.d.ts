/**
 * StatusBar.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform status bar.
 */
import * as RX from '../common/Interfaces';
export declare class StatusBar extends RX.StatusBar {
    isOverlay(): boolean;
    setBarStyle(style: 'default' | 'light-content' | 'dark-content', animated: boolean): void;
    setHidden(hidden: boolean, showHideTransition: 'fade' | 'slide'): void;
    setNetworkActivityIndicatorVisible(value: boolean): void;
    setBackgroundColor(color: string, animated: boolean): void;
    setTranslucent(translucent: boolean): void;
}
declare const _default: StatusBar;
export default _default;
