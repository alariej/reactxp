"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHelpers = void 0;
/**
 * EventHelpers.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */
var react_native_1 = require("react-native");
var EventHelpersCommon = require("../../common/utils/EventHelpers");
var lodashMini_1 = require("./lodashMini");
var _isNativeMacOs = react_native_1.Platform.OS === 'macos';
// These helpers promote a SyntheticEvent to their higher level counterparts
var EventHelpers = /** @class */ (function () {
    function EventHelpers() {
    }
    EventHelpers.prototype.toKeyboardEvent = function (e) {
        // Conversion to a KeyboardEvent-like event if needed
        var keyEvent = e;
        if (keyEvent.keyCode === undefined) {
            // Currently some key codes are dependent on platform. React Native proper (the iOS and Android platforms) have different
            // keycodes for arrow keys when comparing with React (JS).
            // We align the keycodes for native desktop platforms to the other native ones, as a workaround.
            // Ideally all key codes should be consistent OR a set of constants should be exposed by ReactXP.
            var keyName = e.nativeEvent.key;
            var keyCode = 0;
            if (keyName.length === 1) {
                keyCode = keyName.charCodeAt(0);
            }
            else {
                switch (keyName) {
                    // Comma in UWP is not in VirtualKey enum and so comes as stringified int value.
                    case '188':
                        keyCode = 188;
                        break;
                    case 'Backspace':
                    case 'Back':
                        keyCode = 8;
                        break;
                    case 'Tab':
                        keyCode = 9;
                        break;
                    case 'Enter':
                    case 'ENTER':
                        keyCode = 13;
                        break;
                    case 'Shift':
                        keyCode = 16;
                        break;
                    case 'Control':
                        keyCode = 17;
                        break;
                    case 'Alt':
                    case 'Menu':
                        keyCode = 18;
                        break;
                    // keyCode in windows is 93 for context menu button. Since that is already used
                    // for PgDn, picking a keyCode that is not currently assigned in this list.
                    case 'Application':
                        keyCode = 500;
                        break;
                    case 'F1':
                        keyCode = 112;
                        break;
                    case 'F2':
                        keyCode = 113;
                        break;
                    case 'F3':
                        keyCode = 114;
                        break;
                    case 'F4':
                        keyCode = 115;
                        break;
                    case 'F5':
                        keyCode = 116;
                        break;
                    case 'F6':
                        keyCode = 117;
                        break;
                    case 'F7':
                        keyCode = 118;
                        break;
                    case 'F8':
                        keyCode = 119;
                        break;
                    case 'F9':
                        keyCode = 120;
                        break;
                    case 'F10':
                        keyCode = 121;
                        break;
                    case 'F11':
                        keyCode = 122;
                        break;
                    case 'F12':
                        keyCode = 123;
                        break;
                    case 'Escape':
                        keyCode = 27;
                        break;
                    case 'Space':
                        keyCode = 32;
                        break;
                    case 'Delete':
                        keyCode = 46;
                        break;
                    case 'PageUp':
                    case 'PAGE_UP':
                        keyCode = 92;
                        break;
                    case 'PageDown':
                    case 'PAGE_DOWN':
                        keyCode = 93;
                        break;
                    case 'Left':
                    case 'ArrowLeft':
                    case 'LEFT_ARROW':
                        keyCode = 21;
                        break;
                    case 'Up':
                    case 'ArrowUp':
                    case 'UP_ARROW':
                        keyCode = 19;
                        break;
                    case 'Right':
                    case 'ArrowRight':
                    case 'RIGHT_ARROW':
                        keyCode = 22;
                        break;
                    case 'Down':
                    case 'ArrowDown':
                    case 'DOWN_ARROW':
                        keyCode = 20;
                        break;
                    case 'Number0':
                        keyCode = 48;
                        break;
                    case 'Number1':
                        keyCode = 49;
                        break;
                    case 'Number2':
                        keyCode = 50;
                        break;
                    case 'Number3':
                        keyCode = 51;
                        break;
                    case 'Number4':
                        keyCode = 52;
                        break;
                    case 'Number5':
                        keyCode = 53;
                        break;
                    case 'Number6':
                        keyCode = 54;
                        break;
                    case 'Number7':
                        keyCode = 55;
                        break;
                    case 'Number8':
                        keyCode = 56;
                        break;
                    case 'Number9':
                        keyCode = 57;
                        break;
                    case 'Add':
                    case '187':
                        keyCode = 187;
                        break;
                    case 'Subtract':
                    case '189':
                        keyCode = 189;
                        break;
                }
            }
            // Remap some characters on macos
            if (_isNativeMacOs) {
                // Handle F-Keys
                if (keyCode >= 63236 && keyCode <= 63247) {
                    // Re-map to proper F-keys
                    keyCode = keyCode - 632124;
                }
                else if (keyCode === 63272) {
                    // Delete
                    keyCode = 46;
                }
                else if (keyCode === 127) {
                    // Backspace
                    keyCode = 8;
                }
                else if (keyCode >= 632376 && keyCode <= 632377) {
                    // Page Up / Down
                    keyCode = keyCode - 63184;
                }
                else if (keyCode >= 63232 && keyCode <= 63235) {
                    // Arrow Keys
                    keyCode = keyCode - 63213;
                }
            }
            // We need to add keyCode and other properties to the original event, but React Native
            // reuses events, so we're not allowed to modify the original.
            // Instead, we'll clone it.
            keyEvent = lodashMini_1.clone(keyEvent);
            keyEvent.keyCode = keyCode;
            var nativeEvent = e.nativeEvent;
            if (nativeEvent.shiftKey) {
                keyEvent.shiftKey = nativeEvent.shiftKey;
            }
            if (nativeEvent.ctrlKey) {
                keyEvent.ctrlKey = nativeEvent.ctrlKey;
            }
            if (nativeEvent.altKey) {
                keyEvent.altKey = nativeEvent.altKey;
            }
            if (nativeEvent.metaKey) {
                keyEvent.metaKey = nativeEvent.metaKey;
            }
            keyEvent.stopPropagation = function () {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
            };
            keyEvent.preventDefault = function () {
                if (e.preventDefault) {
                    e.preventDefault();
                }
            };
        }
        return keyEvent;
    };
    EventHelpers.prototype.toFocusEvent = function (e) {
        // Ideally we'd like to add a null set "relatedTarget", but the new typing doesn't allow that.
        // So keeping it a noop for now
        return e;
    };
    EventHelpers.prototype.toMouseEvent = function (e) {
        // We need to add various properties to the original event, but React Native
        // reuses events, so we're not allowed to modify the original.
        // Instead, we'll clone it.
        var mouseEvent = lodashMini_1.clone(e);
        var nativeEvent = e.nativeEvent;
        // We keep pageX/Y and clientX/Y coordinates in sync, similar to the React web behavior
        // RN (UWP flavor for this type of event) also pass coordinates in the target view (locationX/Y) that we don't use here.
        if (nativeEvent.pageX !== undefined) {
            mouseEvent.clientX = mouseEvent.pageX = nativeEvent.pageX;
        }
        if (nativeEvent.pageY !== undefined) {
            mouseEvent.clientY = mouseEvent.pageY = nativeEvent.pageY;
        }
        mouseEvent.button = EventHelpersCommon.toMouseButton(e.nativeEvent);
        if (nativeEvent.shiftKey) {
            mouseEvent.shiftKey = nativeEvent.shiftKey;
        }
        if (nativeEvent.ctrlKey) {
            mouseEvent.ctrlKey = nativeEvent.ctrlKey;
        }
        if (nativeEvent.altKey) {
            mouseEvent.altKey = nativeEvent.altKey;
        }
        if (nativeEvent.metaKey) {
            mouseEvent.metaKey = nativeEvent.metaKey;
        }
        mouseEvent.stopPropagation = function () {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
        };
        mouseEvent.preventDefault = function () {
            if (e.preventDefault) {
                e.preventDefault();
            }
        };
        return mouseEvent;
    };
    EventHelpers.prototype.toDragEvent = function (e) {
        var dndEvent = this.toMouseEvent(e);
        dndEvent.dataTransfer = e.nativeEvent.dataTransfer;
        return dndEvent;
    };
    EventHelpers.prototype.isRightMouseButton = function (e) {
        return (EventHelpersCommon.toMouseButton(e.nativeEvent) === 2);
    };
    // Keyboard events do not inherently hold a position that can be used to show flyouts on keyboard input.
    // We simulate a mouse event so that we can show things like context Menus in the correct position.
    // Ensure offset is passed in {x = number, y= number} format. Using Top Left as anchor position.
    EventHelpers.prototype.keyboardToMouseEvent = function (e, layoutInfo, contextMenuOffset) {
        var mouseEvent = this.toMouseEvent(e);
        if ((layoutInfo.x !== undefined) && (contextMenuOffset.x !== undefined)) {
            mouseEvent.clientX = mouseEvent.pageX = layoutInfo.x + contextMenuOffset.x;
        }
        if ((layoutInfo.y !== undefined) && (contextMenuOffset.y !== undefined)) {
            mouseEvent.clientY = mouseEvent.pageY = layoutInfo.y + contextMenuOffset.y;
        }
        return mouseEvent;
    };
    return EventHelpers;
}());
exports.EventHelpers = EventHelpers;
exports.default = new EventHelpers();
