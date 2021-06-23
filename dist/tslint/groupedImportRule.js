"use strict";
/**
* groupedImportRule.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Custom tslint rule used to ensure we don't group ambient (non-relative)
* module imports with relative module imports.
*
* To enable, include the following line in tslint.json:
*   "grouped-import": true
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
var tslint_1 = require("tslint");
var tsutils = require("tsutils");
var ts = require("typescript");
var FAILURE_STRING_PART = 'Ambient and relative imports must be separated';
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var options = this.getOptions();
        var banModuleWalker = new GroupedImportModuleWalker(sourceFile, options);
        return this.applyWithWalker(banModuleWalker);
    };
    return Rule;
}(tslint_1.Rules.AbstractRule));
exports.Rule = Rule;
var ImportType;
(function (ImportType) {
    ImportType[ImportType["None"] = 0] = "None";
    ImportType[ImportType["Relative"] = 1] = "Relative";
    ImportType[ImportType["Ambient"] = 2] = "Ambient";
})(ImportType || (ImportType = {}));
var GroupedImportModuleWalker = /** @class */ (function (_super) {
    __extends(GroupedImportModuleWalker, _super);
    function GroupedImportModuleWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._inImportGroup = false;
        _this._lastImportType = ImportType.None;
        return _this;
    }
    GroupedImportModuleWalker.prototype.visitNode = function (node) {
        if (tsutils.isImportDeclaration(node) || tsutils.isImportEqualsDeclaration(node)) {
            // If last line was linebreak, we're in a new block.
            var prevStatement = tsutils.getPreviousStatement(node);
            var prevLineNum = prevStatement ? ts.getLineAndCharacterOfPosition(this.getSourceFile(), prevStatement.end).line : -1;
            var currentLineNum = ts.getLineAndCharacterOfPosition(this.getSourceFile(), node.end).line;
            if (prevLineNum !== -1 && prevLineNum < currentLineNum - 1) {
                this._lastImportType = ImportType.None;
                this._inImportGroup = false;
            }
            var wasInImportGroup = this._inImportGroup;
            this._inImportGroup = true;
            var importType = this._checkImportType(node);
            if (wasInImportGroup && importType !== this._lastImportType) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING_PART));
            }
            this._lastImportType = importType;
        }
        else {
            this._inImportGroup = false;
            this._lastImportType = ImportType.None;
            _super.prototype.visitNode.call(this, node);
        }
    };
    GroupedImportModuleWalker.prototype._checkImportType = function (node) {
        var modulePath;
        if (tsutils.isImportEqualsDeclaration(node)) {
            if (node.moduleReference.kind === ts.SyntaxKind.ExternalModuleReference) {
                var matches = node.moduleReference.getFullText().match(/require\s*\(\s*'([^']+)'\s*\)/);
                if (matches && matches.length === 2) {
                    modulePath = matches[1];
                }
                else {
                    console.log('Unknown Missed Regex: ' + node.moduleReference.kind + '/' + node.moduleReference.getFullText());
                }
            }
        }
        if (tsutils.isImportDeclaration(node)) {
            modulePath = node.moduleSpecifier.getText().replace(/'/g, '');
        }
        if (modulePath) {
            // Assume that "@" is a shortcut for a relative path.
            if (modulePath[0] === '.' || modulePath[0] === '@') {
                return ImportType.Relative;
            }
            else {
                return ImportType.Ambient;
            }
        }
        return ImportType.None;
    };
    return GroupedImportModuleWalker;
}(tslint_1.RuleWalker));
