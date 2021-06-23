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
import { RuleFailure, Rules } from 'tslint';
import * as ts from 'typescript';
export declare class Rule extends Rules.AbstractRule {
    apply(sourceFile: ts.SourceFile): RuleFailure[];
}
