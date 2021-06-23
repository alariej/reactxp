/**
 * Accessibility.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * An iOS variant of Accessibility that performs announcements by calling
 * React Native announcement API for iOS.
 */
import { Accessibility as NativeAccessibility } from '../native-common/Accessibility';
export declare class Accessibility extends NativeAccessibility {
    private _announcementQueue;
    private _retryTimestamp;
    constructor();
    protected _updateScreenReaderStatus(isEnabled: boolean): void;
    announceForAccessibility(announcement: string): void;
    private _trackQueueStatus;
    private _postAnnouncement;
    private _recalcAnnouncement;
    private _compareRawAnnouncements;
}
declare const _default: Accessibility;
export default _default;
