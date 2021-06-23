/**
 * Button.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Windows-specific implementation of the cross-platform Button abstraction.
 */
import * as React from 'react';
import * as RN from 'react-native';
import { ImportantForAccessibilityValue } from '../native-common/AccessibilityUtil';
import { Button as ButtonBase, ButtonContext as ButtonContextBase } from '../native-common/Button';
import { FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';
export interface ButtonContext extends ButtonContextBase {
    isRxParentAContextMenuResponder?: boolean;
    isRxParentAFocusableInSameFocusManager?: boolean;
}
export declare class Button extends ButtonBase implements React.ChildContextProvider<ButtonContext>, FocusManagerFocusableComponent {
    context: ButtonContext;
    static childContextTypes: React.ValidationMap<any>;
    private _isFocusedWithKeyboard;
    protected _getContextMenuOffset(): {
        x: number;
        y: number;
    };
    protected _render(internalProps: RN.ViewProps, onMount: (btn: any) => void): JSX.Element;
    focus(): void;
    blur(): void;
    setNativeProps(nativeProps: RN.ViewProps): void;
    getChildContext(): ButtonContext;
    private _onAccessibilityTap;
    private _onKeyDown;
    private _onKeyUp;
    private _onFocus;
    private _onBlur;
    protected _onHoverStart: (e: React.SyntheticEvent<any>) => void;
    protected _onHoverEnd: (e: React.SyntheticEvent<any>) => void;
    onFocus(): void;
    getTabIndex(): number | undefined;
    getImportantForAccessibility(): ImportantForAccessibilityValue | undefined;
    updateNativeAccessibilityProps(): void;
}
export default Button;
