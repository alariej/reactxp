/**
 * Styles.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of style functions.
 */
import * as RX from '../common/Interfaces';
export declare class Styles extends RX.Styles {
    combine<S>(ruleSet1: RX.Types.StyleRuleSetRecursive<S> | undefined, ruleSet2?: RX.Types.StyleRuleSetRecursive<S>): RX.Types.StyleRuleSetOrArray<S> | undefined;
    createViewStyle(ruleSet: RX.Types.ViewStyle, cacheStyle?: boolean): RX.Types.ViewStyleRuleSet;
    createAnimatedViewStyle(ruleSet: RX.Types.AnimatedViewStyle): RX.Types.AnimatedViewStyleRuleSet;
    createScrollViewStyle(ruleSet: RX.Types.ScrollViewStyle, cacheStyle?: boolean): RX.Types.ScrollViewStyleRuleSet;
    createButtonStyle(ruleSet: RX.Types.ButtonStyle, cacheStyle?: boolean): RX.Types.ButtonStyleRuleSet;
    createTextStyle(ruleSet: RX.Types.TextStyle, cacheStyle?: boolean): RX.Types.TextStyleRuleSet;
    createAnimatedTextStyle(ruleSet: RX.Types.AnimatedTextStyle): RX.Types.AnimatedTextStyleRuleSet;
    createTextInputStyle(ruleSet: RX.Types.TextInputStyle, cacheStyle?: boolean): RX.Types.TextInputStyleRuleSet;
    createAnimatedTextInputStyle(ruleSet: RX.Types.AnimatedTextInputStyle): RX.Types.AnimatedTextInputStyleRuleSet;
    createImageStyle(ruleSet: RX.Types.ImageStyle, cacheStyle?: boolean): RX.Types.ImageStyleRuleSet;
    createAnimatedImageStyle(ruleSet: RX.Types.AnimatedImageStyle): RX.Types.AnimatedImageStyleRuleSet;
    createLinkStyle(ruleSet: RX.Types.LinkStyle, cacheStyle?: boolean): RX.Types.LinkStyleRuleSet;
    createPickerStyle(ruleSet: RX.Types.PickerStyle, cacheStyle?: boolean): RX.Types.PickerStyleRuleSet;
    getCssPropertyAliasesCssStyle(): {
        [key: string]: string;
    };
    private _adaptStyles;
    private _adaptAnimatedStyles;
}
declare const _default: Styles;
export default _default;
