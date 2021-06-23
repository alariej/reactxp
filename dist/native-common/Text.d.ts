/**
 * Text.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Text abstraction.
 */
import * as React from 'react';
import * as RN from 'react-native';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import { Types } from '../common/Interfaces';
export interface TextContext {
    isRxParentAText: boolean;
    focusArbitrator?: FocusArbitratorProvider;
    isRxParentAContextMenuResponder?: boolean;
}
export declare class Text extends React.Component<Types.TextProps, Types.Stateless> implements React.ChildContextProvider<TextContext> {
    static contextTypes: React.ValidationMap<any>;
    context: TextContext;
    static childContextTypes: React.ValidationMap<any>;
    protected _mountedComponent: RN.Text | undefined;
    setNativeProps(nativeProps: RN.TextProps): void;
    render(): JSX.Element;
    componentDidMount(): void;
    protected _onMount: (component: RN.Text | null) => void;
    protected _getExtendedProperties(): RN.ExtendedTextProps;
    private _onPress;
    getChildContext(): {
        isRxParentAText: boolean;
    };
    protected _getStyles(): Types.StyleRuleSetRecursiveArray<Types.TextStyleRuleSet>;
    requestFocus(): void;
    focus(): void;
    blur(): void;
    getSelectedText(): string;
}
export default Text;
