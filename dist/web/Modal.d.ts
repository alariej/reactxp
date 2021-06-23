/**
 * Modal.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Modal abstraction.
 */
import * as React from 'react';
import * as RX from '../common/Interfaces';
export declare class Modal extends RX.Modal {
    isDisplayed(modalId?: string): boolean;
    show(modal: React.ReactElement<RX.Types.ViewProps>, modalId: string, options?: RX.Types.ModalOptions): void;
    dismiss(modalId: string): void;
    dismissAll(): void;
}
declare const _default: Modal;
export default _default;
