/**
 * AccessibilityUtil.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Common accessibility interface for platform-specific accessibility utilities.
 */
import * as React from 'react';
import { Types } from '../common/Interfaces';
export declare type ImportantForAccessibilityValue = 'auto' | 'yes' | 'no' | 'no-hide-descendants';
export declare const ImportantForAccessibilityMap: {
    1: ImportantForAccessibilityValue;
    2: ImportantForAccessibilityValue;
    3: ImportantForAccessibilityValue;
    4: ImportantForAccessibilityValue;
};
export declare abstract class AccessibilityPlatformUtil {
    abstract setAccessibilityFocus(component: React.Component<any, any>): void;
}
export declare abstract class AccessibilityUtil {
    isHidden(importantForAccessibility: Types.ImportantForAccessibility | undefined): true | undefined;
    importantForAccessibilityToString(importantForAccessibility: Types.ImportantForAccessibility | undefined, defaultImportantForAccessibility?: Types.ImportantForAccessibility): ImportantForAccessibilityValue | undefined;
    protected abstract accessibilityLiveRegionToString(liveRegion: Types.AccessibilityLiveRegion): string | undefined;
    protected abstract accessibilityTraitToString(trait: Types.AccessibilityTrait | Types.AccessibilityTrait[], defaultTrait?: Types.AccessibilityTrait): string | string[] | undefined;
}
