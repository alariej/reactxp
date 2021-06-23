/**
 * App.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of App API namespace.
 */
import * as RN from 'react-native';
import * as RX from '../common/Interfaces';
export declare class App extends RX.App {
    constructor();
    initialize(debug: boolean, development: boolean): void;
    getActivationState(): RX.Types.AppActivationState;
    protected getRootViewFactory(): RN.ComponentProvider;
    protected getRootViewUsingPropsFactory(): RN.ComponentProvider;
}
declare const _default: App;
export default _default;
