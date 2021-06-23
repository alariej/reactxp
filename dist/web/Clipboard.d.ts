/**
 * Clipboard.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Clipboard abstraction.
 */
import * as RX from '../common/Interfaces';
export declare class Clipboard extends RX.Clipboard {
    setText(text: string): void;
    getText(): Promise<string>;
    private static _createInvisibleNode;
    private static _copyNode;
}
declare const _default: Clipboard;
export default _default;
