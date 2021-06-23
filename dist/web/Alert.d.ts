/**
 * Alert.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web Alert dialog boxes.
 */
import * as RX from '../common/Interfaces';
export declare class Alert extends RX.Alert {
    private _modalId;
    show(title: string, message?: string, buttons?: RX.Types.AlertButtonSpec[], options?: RX.Types.AlertOptions): void;
}
declare const _default: Alert;
export default _default;
