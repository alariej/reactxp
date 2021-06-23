/**
 * Input.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Desktop implementation of Input interface.
 */
import { Input as InputCommon } from '../native-common/Input';
import { Types } from '../common/Interfaces';
export declare class Input extends InputCommon {
    constructor();
    dispatchKeyDown(e: Types.KeyboardEvent): void;
    dispatchKeyUp(e: Types.KeyboardEvent): void;
}
declare const _default: Input;
export default _default;
