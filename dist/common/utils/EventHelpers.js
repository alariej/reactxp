"use strict";
/**
 * EventHelpers.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMouseButton = void 0;
function toMouseButton(nativeEvent) {
    if (nativeEvent.button !== undefined) {
        return nativeEvent.button;
    }
    else if (nativeEvent.isRightButton || nativeEvent.IsRightButton) {
        return 2;
    }
    else if (nativeEvent.isMiddleButton || nativeEvent.IsMiddleButton) {
        return 1;
    }
    return 0;
}
exports.toMouseButton = toMouseButton;
