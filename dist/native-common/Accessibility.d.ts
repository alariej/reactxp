/**
 * Accessibility.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native wrapper for accessibility helper.
 */
import { Accessibility as CommonAccessibility } from '../common/Accessibility';
import { Types } from '../common/Interfaces';
export interface MacComponentAccessibilityProps {
    onClick?: (e: Types.SyntheticEvent) => void;
    acceptsKeyboardFocus?: true;
    enableFocusRing?: true;
}
export declare class Accessibility extends CommonAccessibility {
    protected _isScreenReaderEnabled: boolean;
    constructor();
    protected _updateScreenReaderStatus(isEnabled: boolean): void;
    isScreenReaderEnabled(): boolean;
}
declare const _default: Accessibility;
export default _default;
