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
import { RuleFailure, Rules } from 'tslint';
import * as ts from 'typescript';
export declare class Rule extends Rules.AbstractRule {
    apply(sourceFile: ts.SourceFile): RuleFailure[];
}
