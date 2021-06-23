"use strict";
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
exports.View = void 0;
var EventHelpers_1 = require("../native-common/utils/EventHelpers");
var View_1 = require("../native-common/View");
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    View.prototype._buildInternalProps = function (props) {
        // Base class does the bulk of _internalprops creation
        _super.prototype._buildInternalProps.call(this, props);
        var _loop_1 = function (name_1) {
            var handler = this_1._internalProps[name_1];
            if (handler) {
                this_1._internalProps.allowDrop = true;
                this_1._internalProps[name_1] = function (e) {
                    var dndEvent = EventHelpers_1.default.toDragEvent(e);
                    handler(dndEvent);
                };
            }
        };
        var this_1 = this;
        // Drag and drop related properties
        for (var _i = 0, _a = ['onDragEnter', 'onDragOver', 'onDrop', 'onDragLeave']; _i < _a.length; _i++) {
            var name_1 = _a[_i];
            _loop_1(name_1);
        }
        var _loop_2 = function (name_2) {
            var handler = this_2._internalProps[name_2];
            if (handler) {
                if (name_2 === 'onDragStart') {
                    this_2._internalProps.allowDrag = true;
                }
                this_2._internalProps[name_2] = function (e) {
                    var dndEvent = EventHelpers_1.default.toDragEvent(e);
                    handler(dndEvent);
                };
            }
        };
        var this_2 = this;
        for (var _b = 0, _c = ['onDragStart', 'onDrag', 'onDragEnd']; _b < _c.length; _b++) {
            var name_2 = _c[_b];
            _loop_2(name_2);
        }
    };
    return View;
}(View_1.View));
exports.View = View;
exports.default = View;
