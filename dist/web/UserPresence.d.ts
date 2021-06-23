/**
 * UserPresence.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the ReactXP interfaces related to
 * user presence.
 *
 * User is considered present when user is focused on the App and has interacted with the App in the last 60 seconds.
 * User is considered not present, if app is not focused (backgrounded or blurred) or the app is focused
 * but the user has not intereacted with the app in the last 60 seconds
 */
import * as RX from '../common/Interfaces';
export declare class UserPresence extends RX.UserPresence {
    private _isPresent;
    constructor();
    isUserPresent(): boolean;
    private _setUserPresent;
    private _handleWakeup;
    private _handleIdle;
    private _handleFocus;
    private _handleBlur;
}
declare const instance: UserPresence;
export default instance;
