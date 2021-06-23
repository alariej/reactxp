/**
 * AccessibilityUtil.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of accessiblity functions for cross-platform
 * ReactXP framework.
 */
import { AccessibilityUtil as CommonAccessibiltiyUtil } from '../common/AccessibilityUtil';
import { Types } from '../common/Interfaces';
export declare class AccessibilityUtil extends CommonAccessibiltiyUtil {
    accessibilityLiveRegionToString(liveRegion: Types.AccessibilityLiveRegion): Types.AriaLive | undefined;
    accessibilityTraitToString(traits: Types.AccessibilityTrait | Types.AccessibilityTrait[] | undefined, defaultTrait?: Types.AccessibilityTrait): string | undefined;
    accessibilityTraitToAriaSelected(traits: Types.AccessibilityTrait | Types.AccessibilityTrait[] | undefined): boolean | undefined;
    accessibilityTraitToAriaChecked(traits: Types.AccessibilityTrait | Types.AccessibilityTrait[] | undefined): boolean | undefined;
    accessibilityTraitToAriaHasPopup(traits: Types.AccessibilityTrait | Types.AccessibilityTrait[] | undefined): boolean | undefined;
}
declare const _default: AccessibilityUtil;
export default _default;
