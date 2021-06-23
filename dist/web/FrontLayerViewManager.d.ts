/**
 * FrontLayerViewManager.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Manages the layering of the main view, modals and popups.
 */
import * as React from 'react';
import { Types } from '../common/Interfaces';
export declare class FrontLayerViewManager {
    private _mainView;
    private _modalStack;
    private _activePopupOptions;
    private _activePopupId;
    private _activePopupAutoDismiss;
    private _activePopupAutoDismissDelay;
    private _activePopupShowDelay;
    private _popupShowDelayTimer;
    private _cachedPopups;
    private _isRtlDefault;
    private _isRtlAllowed;
    private _isRtlForced;
    setMainView(element: React.ReactElement<any>): void;
    isModalDisplayed(modalId?: string): boolean;
    showModal(modal: React.ReactElement<Types.ViewProps>, modalId: string, options?: Types.ModalOptions): void;
    dismissModal(modalId: string): void;
    dismissAllModals(): void;
    private _shouldPopupBeDismissed;
    private _updateModalDisplayedState;
    showPopup(options: Types.PopupOptions, popupId: string, showDelay?: number): boolean;
    private _showPopup;
    autoDismissPopup(popupId: string, dismissDelay?: number): void;
    dismissPopup(popupId: string): void;
    dismissAllPopups(): void;
    private _renderRootView;
    isPopupDisplayed(popupId?: string): boolean;
    allowRTL(allow: boolean): void;
    forceRTL(force: boolean): void;
    isRTL(): boolean;
}
declare const _default: FrontLayerViewManager;
export default _default;
