"use strict";
/**
 * StyleLeakDetector.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of debugging logic that detects style leaks.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleLeakDetector = void 0;
var RN = require("react-native");
var StyleLeakDetector_1 = require("../common/StyleLeakDetector");
var StyleLeakDetector = /** @class */ (function (_super) {
    __extends(StyleLeakDetector, _super);
    function StyleLeakDetector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StyleLeakDetector.prototype.isDisabled = function () {
        // Disable StyleLeakDetector in UWP apps because the way Chakra reports
        // line numbers breaks the leak detector. Specifically, function calls
        // in an object literal are all reported to be on the same line. For
        // example, suppose we have this code:
        //
        //   1:  const _styles = {
        //   2:      fillScreen: RX.Styles.createViewStyle({
        //   3:          flex: 1,
        //   4:          flexDirection: 'column',
        //   5:          alignSelf: 'stretch'
        //   6:      }),
        //   7:      content: RX.Styles.createViewStyle({
        //   8:          flex: 1,
        //   9:          flexDirection: 'column',
        //   10:         alignSelf: 'stretch'
        //   11:     })
        //   12: };
        //
        // The StyleLeakDetector expects the JS engine to report to it that
        // the style for `fillScreen` occurs on line 2 and the style for `content`
        // occurs on line 7. However, Chakra reports that both `fillScreen` and
        // `content` occur on the same line (1) causing the StyleLeakDetector to
        // falsely report a style leak.
        return RN.Platform.OS === 'windows';
    };
    return StyleLeakDetector;
}(StyleLeakDetector_1.StyleLeakDetector));
exports.StyleLeakDetector = StyleLeakDetector;
exports.default = new StyleLeakDetector();
