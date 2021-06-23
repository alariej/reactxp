/**
 * Linking.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Common implementation for deep linking.
 */
import * as RX from './Interfaces';
export declare abstract class Linking extends RX.Linking {
    protected abstract _openUrl(url: string): Promise<void>;
    launchSms(phoneInfo: RX.Types.SmsInfo): Promise<void>;
    openUrl(url: string): Promise<void>;
    protected _createEmailUrl(emailInfo: RX.Types.EmailInfo): string;
    protected _createSmsUrl(smsInfo: RX.Types.SmsInfo): string;
    private _isEmailValid;
    private _filterValidEmails;
}
