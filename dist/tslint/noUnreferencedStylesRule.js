"use strict";
/**
* noUnreferencedStylesRule.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Custom tslint rule used to enforce that there are no unfreferenced
* entries in a static array named "_styles".
*
* To enable this rule, add the following line to your tslint.json:
*   "no-unreferenced-styles": true
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
var ts = require("typescript");
var STYLES_NOT_CONST = 'Styles array is not marked const';
var STYLE_NOT_REFERENCED = 'Unreferenced style ';
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var options = this.getOptions();
        var stylesWalker = new StylesWalker(sourceFile, options);
        return this.applyWithWalker(stylesWalker);
    };
    return Rule;
}(tslint_1.Rules.AbstractRule));
exports.Rule = Rule;
var StylesWalker = /** @class */ (function (_super) {
    __extends(StylesWalker, _super);
    function StylesWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._definedStyles = {};
        return _this;
    }
    StylesWalker.prototype.walk = function (node) {
        _super.prototype.walk.call(this, node);
        this._reportUnreferencedStyles();
    };
    StylesWalker.prototype.visitVariableDeclaration = function (node) {
        // Is this a _styles node?
        if (node.name.getText() === '_styles' && node.initializer) {
            var nodeFlags = ts.getCombinedNodeFlags(node);
            // All styles should be const.
            if ((nodeFlags & ts.NodeFlags.Const) === 0) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), STYLES_NOT_CONST));
            }
            // Add known styles recursively.
            this._addKnownStyles(node.initializer, '_styles.');
        }
    };
    StylesWalker.prototype._addKnownStyles = function (node, prefix) {
        var _this = this;
        var hasChildren = false;
        if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            var objLiteral = node;
            if (objLiteral.properties) {
                _.each(objLiteral.properties, function (property) {
                    var nodeName = prefix + property.name.getText();
                    // Recurse to pick up any nested style types.
                    var children = property.getChildren();
                    var childHasChildren = false;
                    _.each(children, function (child) {
                        if (_this._addKnownStyles(child, nodeName + '.')) {
                            childHasChildren = true;
                        }
                    });
                    // Don't add the node if it's just a container for
                    // other styles.
                    if (!childHasChildren) {
                        _this._definedStyles[nodeName] = {
                            isReferenced: false,
                            start: property.getStart(),
                            width: property.getWidth(),
                        };
                    }
                    hasChildren = true;
                });
            }
        }
        return hasChildren;
    };
    StylesWalker.prototype.visitFunctionDeclaration = function (node) {
        this._markReferencedStyles(node.getText());
    };
    StylesWalker.prototype.visitConstructorDeclaration = function (node) {
        this._markReferencedStyles(node.getText());
    };
    StylesWalker.prototype.visitMethodDeclaration = function (node) {
        this._markReferencedStyles(node.getText());
    };
    StylesWalker.prototype.visitArrowFunction = function (node) {
        this._markReferencedStyles(node.getText());
    };
    StylesWalker.prototype.visitPropertyDeclaration = function (node) {
        this._markReferencedStyles(node.getText());
    };
    StylesWalker.prototype._markReferencedStyles = function (functionText) {
        var _this = this;
        var stylesRegEx = /_styles\.[_.a-zA-Z0-9]+/g;
        var matches = functionText.match(stylesRegEx);
        if (matches) {
            _.each(matches, function (match) {
                // Note that this style has been referenced.
                if (_this._definedStyles[match] !== undefined) {
                    _this._definedStyles[match].isReferenced = true;
                }
            });
        }
    };
    StylesWalker.prototype._reportUnreferencedStyles = function () {
        var _this = this;
        _.each(this._definedStyles, function (styleInfo, styleName) {
            if (!styleInfo.isReferenced) {
                _this.addFailure(_this.createFailure(styleInfo.start, styleInfo.width, STYLE_NOT_REFERENCED + styleName));
            }
        });
    };
    return StylesWalker;
}(tslint_1.RuleWalker));
