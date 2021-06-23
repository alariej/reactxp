/**
 * Platform.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of Platform interface.
 */
import * as RX from '../common/Interfaces';
export declare class Platform extends RX.Platform {
    getType(): RX.Types.PlatformType;
    select<T>(specifics: {
        [platform in RX.Types.PlatformType | 'default']?: T;
    }): T | undefined;
}
declare const _default: Platform;
export default _default;
