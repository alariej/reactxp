/**
 * Picker.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Picker abstraction.
 */
/// <reference types="react" />
import * as RX from '../common/Interfaces';
export declare class Picker extends RX.Picker {
    render(): JSX.Element;
    onValueChange: (itemValue: any, itemPosition: number) => void;
}
export default Picker;
