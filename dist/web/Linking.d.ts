/**
 * Linking.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation for deep linking
 */
import { Types } from '../common/Interfaces';
import { Linking as CommonLinking } from '../common/Linking';
export declare class Linking extends CommonLinking {
    protected _openUrl(url: string): Promise<void>;
    launchEmail(emailInfo: Types.EmailInfo): Promise<void>;
    getInitialUrl(): Promise<string | undefined>;
}
declare const _default: Linking;
export default _default;
