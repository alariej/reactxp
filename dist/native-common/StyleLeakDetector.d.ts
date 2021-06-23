/**
 * StyleLeakDetector.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of debugging logic that detects style leaks.
 */
import { StyleLeakDetector as CommonStyleLeakDetector } from '../common/StyleLeakDetector';
export declare class StyleLeakDetector extends CommonStyleLeakDetector {
    protected isDisabled(): boolean;
}
declare const _default: StyleLeakDetector;
export default _default;
