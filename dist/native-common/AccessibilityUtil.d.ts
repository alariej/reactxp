/**
 * AccessibilityUtil.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of accessiblity functions for cross-platform
 * ReactXP framework.
 */
import * as React from 'react';
import * as RN from 'react-native';
import { AccessibilityPlatformUtil, AccessibilityUtil as CommonAccessibilityUtil } from '../common/AccessibilityUtil';
import { Types } from '../common/Interfaces';
export { ImportantForAccessibilityValue } from '../common/AccessibilityUtil';
declare type AccessibilityLiveRegionValue = 'none' | 'polite' | 'assertive';
declare type AccessibilityComponentTypeValue = 'none' | 'button' | 'radiobutton_checked' | 'radiobutton_unchecked';
export declare class AccessibilityUtil extends CommonAccessibilityUtil {
    private _instance;
    setAccessibilityPlatformUtil(instance: AccessibilityPlatformUtil): void;
    accessibilityTraitToString(overrideTraits: Types.AccessibilityTrait | Types.AccessibilityTrait[] | undefined, defaultTrait?: Types.AccessibilityTrait, ensureDefaultTrait?: boolean): RN.AccessibilityTrait[] | undefined;
    accessibilityComponentTypeToString(overrideTraits: Types.AccessibilityTrait | Types.AccessibilityTrait[] | undefined, defaultTrait?: Types.AccessibilityTrait): AccessibilityComponentTypeValue | undefined;
    accessibilityLiveRegionToString(liveRegion: Types.AccessibilityLiveRegion | undefined): AccessibilityLiveRegionValue | undefined;
    setAccessibilityFocus(component: React.Component<any, any>): void;
}
declare const _default: AccessibilityUtil;
export default _default;
