/**
 * Storage.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform database storage abstraction.
 */
import * as RX from '../common/Interfaces';
export declare class Storage extends RX.Storage {
    getItem(key: string): Promise<string | undefined>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
}
declare const _default: Storage;
export default _default;
