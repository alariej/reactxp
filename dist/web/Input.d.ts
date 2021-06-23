/**
 * Input.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web implementation of Input interface.
 */
import * as RX from '../common/Interfaces';
export declare class Input extends RX.Input {
    dispatchKeyDown(e: RX.Types.KeyboardEvent): void;
    dispatchKeyUp(e: RX.Types.KeyboardEvent): void;
}
declare const _default: Input;
export default _default;
