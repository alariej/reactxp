/**
 * Link.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Desktop-specific implementation of the cross-platform Link abstraction.
 */
/// <reference types="react" />
import * as RN from 'react-native';
import { ImportantForAccessibilityValue } from '../native-common/AccessibilityUtil';
import { FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';
import { Types } from '../common/Interfaces';
import { LinkBase } from '../native-common/Link';
export interface LinkState {
    isRestrictedOrLimited: boolean;
}
export declare class Link extends LinkBase<LinkState> implements FocusManagerFocusableComponent {
    protected _getContextMenuOffset(): {
        x: number;
        y: number;
    };
    constructor(props: Types.LinkProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    private _restrictedOrLimitedCallback;
    protected _render(internalProps: RN.TextProps, onMount: (text: any) => void): JSX.Element;
    private _renderLinkAsFocusableText;
    private _focusableElement;
    private _onFocusableRef;
    private _createFocusableTextProps;
    private _nativeHyperlinkElement;
    private _onNativeHyperlinkRef;
    private _renderLinkAsNativeHyperlink;
    focus(): void;
    blur(): void;
    setNativeProps(nativeProps: RN.TextProps): void;
    requestFocus(): void;
    private _isAvailableToFocus;
    private _onKeyDown;
    private _onKeyUp;
    private _onFocus;
    onFocus(): void;
    getTabIndex(): number | undefined;
    getImportantForAccessibility(): ImportantForAccessibilityValue | undefined;
    updateNativeAccessibilityProps(): void;
}
export default Link;
