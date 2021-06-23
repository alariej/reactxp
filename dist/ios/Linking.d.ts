/**
 * Linking.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * iOS-specific implementation for deep linking.
 */
import { Types } from '../common/Interfaces';
import { Linking as CommonLinking } from '../native-common/Linking';
export declare class Linking extends CommonLinking {
    protected _createSmsUrl(smsInfo: Types.SmsInfo): string;
}
declare const _default: Linking;
export default _default;
