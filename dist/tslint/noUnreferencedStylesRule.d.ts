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
import { RuleFailure, Rules } from 'tslint';
import * as ts from 'typescript';
export declare class Rule extends Rules.AbstractRule {
    apply(sourceFile: ts.SourceFile): RuleFailure[];
}
