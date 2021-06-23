/**
 * Alert.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native Alert dialog boxes for ReactXP.
 */
import * as RX from '../common/Interfaces';
export declare class Alert implements RX.Alert {
    show(title: string, message?: string, buttons?: RX.Types.AlertButtonSpec[], options?: RX.Types.AlertOptions): void;
}
declare const _default: Alert;
export default _default;
