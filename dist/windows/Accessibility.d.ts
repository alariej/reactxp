/**
 * Accessibility.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */
import { Accessibility as NativeAccessibility } from '../native-common/Accessibility';
export declare class Accessibility extends NativeAccessibility {
    private _isHighContrast;
    constructor();
    private _updateIsHighContrast;
    isHighContrastEnabled(): boolean;
}
declare const _default: Accessibility;
export default _default;
