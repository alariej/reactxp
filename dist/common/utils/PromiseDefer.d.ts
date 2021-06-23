/**
 * PromiseDefer.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Creates a deferral object that wraps promises with easier to use type-safety
 */
export declare class Defer<T> {
    private _promise;
    private _resolver;
    private _rejector;
    constructor();
    resolve(value: T): void;
    reject(value: any): void;
    promise(): Promise<T>;
}
