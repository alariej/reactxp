/**
 * Popup.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Popup abstraction.
 */
import * as RX from '../common/Interfaces';
export declare class Popup extends RX.Popup {
    show(options: RX.Types.PopupOptions, popupId: string, delay?: number): boolean;
    autoDismiss(popupId: string, delay?: number): void;
    dismiss(popupId: string): void;
    dismissAll(): void;
    isDisplayed(popupId?: string): boolean;
}
declare const _default: Popup;
export default _default;
