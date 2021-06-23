/**
 * Picker.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Select abstraction.
 */
/// <reference types="react" />
import * as RX from '../common/Interfaces';
export declare class Picker extends RX.Picker {
    render(): JSX.Element;
    private _getStyles;
    private _onValueChange;
}
export default Picker;
