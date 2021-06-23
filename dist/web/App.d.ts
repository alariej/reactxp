/**
 * App.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Implements App interface for ReactXP.
 */
import * as RX from '../common/Interfaces';
export declare class App extends RX.App {
    private _activationState;
    constructor();
    initialize(debug: boolean, development: boolean): void;
    getActivationState(): RX.Types.AppActivationState;
    private _setActivationState;
}
declare const _default: App;
export default _default;
