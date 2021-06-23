/**
 * AccessibilityUtil.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Windows-specific accessibility utils.
 */
import * as React from 'react';
import { AccessibilityPlatformUtil } from '../common/AccessibilityUtil';
export declare class AccessibilityUtil extends AccessibilityPlatformUtil {
    setAccessibilityFocus(component: React.Component<any, any>): void;
}
declare const _default: AccessibilityUtil;
export default _default;
