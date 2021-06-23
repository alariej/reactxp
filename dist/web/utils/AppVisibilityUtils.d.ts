/**
 * AppVisibilityUtils.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific helpers for firing focus/activity related events
 */
import SubscribableEvent from 'subscribableevent';
export declare class AppVisibilityUtils {
    private _isIdle;
    private _timer;
    readonly onFocusedEvent: SubscribableEvent<() => void>;
    readonly onBlurredEvent: SubscribableEvent<() => void>;
    readonly onAppForegroundedEvent: SubscribableEvent<() => void>;
    readonly onAppBackgroundedEvent: SubscribableEvent<() => void>;
    readonly onIdleEvent: SubscribableEvent<() => void>;
    readonly onWakeUpEvent: SubscribableEvent<() => void>;
    constructor();
    hasFocusAndActive(): boolean;
    hasFocus(): boolean;
    isAppInForeground(): boolean;
    private _trackIdleStatus;
    private _wakeUpAndSetTimerForIdle;
    private _onFocus;
    private _onBlur;
    private _onAppVisibilityChanged;
    private _onWakeUp;
    private _onIdle;
}
declare const _default: AppVisibilityUtils;
export default _default;
