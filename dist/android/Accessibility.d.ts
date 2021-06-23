/**
 * Accessibility.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Common wrapper for accessibility helper exposed from ReactXP.
 */
import { Accessibility as NativeAccessibility } from '../native-common/Accessibility';
export declare class Accessibility extends NativeAccessibility {
    private _lastAnnouncement;
    announceForAccessibility(announcement: string): void;
}
declare const _default: Accessibility;
export default _default;
