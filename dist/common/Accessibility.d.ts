/**
 * Accessibility.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Common wrapper for accessibility helper exposed from ReactXP.
 */
import SubscribableEvent from 'subscribableevent';
import * as RX from '../common/Interfaces';
export declare abstract class Accessibility extends RX.Accessibility {
    abstract isScreenReaderEnabled(): boolean;
    screenReaderChangedEvent: SubscribableEvent<(isEnabled: boolean) => void>;
    isHighContrastEnabled(): boolean;
    newAnnouncementReadyEvent: SubscribableEvent<(announcement: string) => void>;
    announceForAccessibility(announcement: string): void;
}
export default Accessibility;
