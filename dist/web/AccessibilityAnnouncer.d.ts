/**
 * AccessibilityAnnouncer.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Implements the behavior for announcing text to screen readers, using aria-live regions.
 */
import * as React from 'react';
export interface AccessibilityAnnouncerState {
    announcementText: string;
    announcementTextInNestedDiv: boolean;
}
export declare class AccessibilityAnnouncer extends React.Component<{}, AccessibilityAnnouncerState> {
    private _clearAnnouncementTimer;
    private _newAnnouncementEventChangedSubscription;
    constructor(props: {});
    private _getInitialState;
    componentDidUpdate(prevProps: {}, prevState: AccessibilityAnnouncerState): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private _cancelClearAnnouncementTimer;
    private _startClearAnnouncementTimer;
}
export default AccessibilityAnnouncer;
