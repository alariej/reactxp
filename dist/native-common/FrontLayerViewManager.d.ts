/**
 * FrontLayerViewManager.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Manages stackable modals and popup views that are posted and dismissed
 * by the Types showModal/dismissModal/showPopup/dismissPopup methods.
 */
import * as React from 'react';
import SubscribableEvent from 'subscribableevent';
import { Types } from '../common/Interfaces';
export declare class FrontLayerViewManager {
    private _overlayStack;
    private _cachedPopups;
    event_changed: SubscribableEvent<() => void>;
    showModal(modal: React.ReactElement<Types.ViewProps>, modalId: string, options?: Types.ModalOptions): void;
    isModalDisplayed(modalId?: string): boolean;
    dismissModal(modalId: string): void;
    dismissAllmodals(): void;
    showPopup(popupOptions: Types.PopupOptions, popupId: string, delay?: number): boolean;
    dismissPopup(popupId: string): void;
    dismissAllPopups(): void;
    getModalLayerView(rootViewId?: string | null): React.ReactElement<any> | null;
    getActivePopupId(): string | null;
    releaseCachedPopups(): void;
    private _modalOptionsMatchesRootViewId;
    private _renderPopup;
    private _getOverlayContext;
    isPopupActiveFor(rootViewId?: string | null): boolean;
    getPopupLayerView(rootViewId?: string | null): JSX.Element | null;
    private _onBackgroundPressed;
    private _dismissActivePopup;
    private _findIndexOfModal;
    private _findIndexOfPopup;
    private _getActiveOverlay;
    isPopupDisplayed(popupId?: string): boolean;
}
declare const _default: FrontLayerViewManager;
export default _default;
