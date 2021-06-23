/**
 * StatusBar.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * MacOS-specific implementation of StatusBar APIs.
 */
import * as RX from '../common/Interfaces';
export declare class StatusBar extends RX.StatusBar {
    isOverlay(): boolean;
    setHidden(hidden: boolean, showHideTransition: 'fade' | 'slide'): void;
    setBackgroundColor(color: string, animated: boolean): void;
    setTranslucent(translucent: boolean): void;
    setBarStyle(style: 'default' | 'light-content' | 'dark-content', animated: boolean): void;
    setNetworkActivityIndicatorVisible(value: boolean): void;
}
declare const _default: StatusBar;
export default _default;
