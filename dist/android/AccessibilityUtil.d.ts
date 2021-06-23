/**
 * AccessibilityUtil.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Android-specific accessibility utils.
 */
import * as React from 'react';
import { AccessibilityPlatformUtil as CommonAccessibilityNativeUtil } from '../common/AccessibilityUtil';
export declare class AccessibilityUtil extends CommonAccessibilityNativeUtil {
    private _sendAccessibilityEvent;
    setAccessibilityFocus(component: React.Component<any, any>): void;
}
declare const _default: AccessibilityUtil;
export default _default;
