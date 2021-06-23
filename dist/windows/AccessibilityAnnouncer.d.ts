/**
 * AccessibilityAnnouncer.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Implements the behavior for announcing text via screen readers.
 */
import * as React from 'react';
export declare class AccessibilityAnnouncer extends React.Component<{}, {}> {
    private _viewElement;
    private _announcementQueue;
    private _announcementQueueTimer;
    private _newAnnouncementEventChangedSubscription;
    private _lastAnnouncement;
    constructor(props: {});
    componentWillUnmount(): void;
    render(): JSX.Element;
    private _onViewRef;
    private _tryDequeueAndAnnounce;
    private _dequeueAndPostAnnouncement;
}
export default AccessibilityAnnouncer;
