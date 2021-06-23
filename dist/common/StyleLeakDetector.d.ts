/**
 * StyleLeakDetector.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Detects style memory-leaks in react-native.
 * To fix warning you could:
 *  - use not cached styles by providing cacheStyle == false to Style.create... method
 *  - for colors you could use StylesRegestry component
 *  - for rx component you could temporary disable validation by calling pause method and restore by calling resume,
 *    but please make sure that it doesn't leaks first please
 */
import { Types } from './Interfaces';
export declare class StyleLeakDetector {
    private _fingerprintRegistry;
    private _getFingerprint;
    /**
     * We need to sort objects before using JSON.stringify as otherwise objects
     * {a: 1, b: 2} and {b: 2, a: 1} would have a different fingerprints
     */
    private _sortAny;
    private _sortObject;
    private _sortArray;
    protected isDisabled(): boolean;
    detectLeaks<T extends Types.ViewAndImageCommonStyle>(style: T): void;
}
declare const _default: StyleLeakDetector;
export default _default;
