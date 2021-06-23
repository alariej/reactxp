"use strict";
/**
* incorrectThisPropsRule.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Custom tslint rule used to find cases where the code references
* this.props rather than props in the _buildState method and other
* methods that take an input parameter called "props".
*
* To enable, add the following line to your tslint.json file:
*       "incorrect-this-props": true
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
exports.Rule = void 0;
var _ = require("lodash");
var tslint_1 = require("tslint");
var THIS_PROPS_REFERENCED = '"this.props" referenced within method that takes "props" input parameter.' +
    ' In most cases this is a mistake and you want to use "props",' +
    ' if you are sure you need this.props - use "const oldProps = this.props;"';
var THIS_PROPS = 'this.props';
var ALLOWED_OLD_PROPS = 'oldProps = ' + THIS_PROPS;
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var options = this.getOptions();
        var thisPropsWalker = new ThisPropsWalker(sourceFile, options);
        return this.applyWithWalker(thisPropsWalker);
    };
    return Rule;
}(tslint_1.Rules.AbstractRule));
exports.Rule = Rule;
var ThisPropsWalker = /** @class */ (function (_super) {
    __extends(ThisPropsWalker, _super);
    function ThisPropsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ThisPropsWalker.prototype.walk = function (node) {
        _super.prototype.walk.call(this, node);
    };
    ThisPropsWalker.prototype.visitMethodDeclaration = function (node) {
        var hasPropsParam = _.find(node.parameters, function (param) {
            var paramNameIdentifier = param.name;
            return (paramNameIdentifier && paramNameIdentifier.text === 'props');
        });
        if (hasPropsParam) {
            var methodText = node.getText();
            var searchOffset = 0;
            while (true) {
                var foundOffset = methodText.indexOf(THIS_PROPS, searchOffset);
                if (foundOffset < 0 || foundOffset >= methodText.length) {
                    break;
                }
                // See if this is an allowed case ('oldProps = this.props').
                var allowedOffset = foundOffset + THIS_PROPS.length - ALLOWED_OLD_PROPS.length;
                if (allowedOffset >= 0 && methodText.indexOf(ALLOWED_OLD_PROPS, allowedOffset) === allowedOffset) {
                    searchOffset = foundOffset + THIS_PROPS.length;
                    continue;
                }
                // We found a disallowed instance of 'this.props' within a method that has
                // a 'props' input parameter. Flag it as an error.
                this.addFailure(this.createFailure(node.name.getStart() + foundOffset, THIS_PROPS.length, THIS_PROPS_REFERENCED));
                searchOffset = foundOffset + THIS_PROPS.length;
            }
        }
    };
    return ThisPropsWalker;
}(tslint_1.RuleWalker));
