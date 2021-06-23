/**
 * FocusManager.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Manages focusable elements for better keyboard navigation (RN desktop version)
 */
import { ImportantForAccessibilityValue } from '../../native-common/AccessibilityUtil';
import { FocusableComponentInternal as FocusableComponentInternalBase, FocusableComponentStateCallback, FocusManager as FocusManagerBase, StoredFocusableComponent as StoredFocusableComponentBase } from '../../common/utils/FocusManager';
export { FocusableComponentStateCallback };
export declare enum OverrideType {
    None = 0,
    Accessible = 1,
    Limited = 2
}
export interface StoredFocusableComponent extends StoredFocusableComponentBase {
    curOverrideType?: OverrideType;
}
export interface FocusManagerFocusableComponent {
    getTabIndex(): number | undefined;
    getImportantForAccessibility(): ImportantForAccessibilityValue | undefined;
    onFocus(): void;
    focus(): void;
    updateNativeAccessibilityProps(): void;
}
export interface FocusableComponentInternal extends FocusManagerFocusableComponent, FocusableComponentInternalBase {
    tabIndexOverride?: number;
    tabIndexLocalOverride?: number;
    tabIndexLocalOverrideTimer?: number;
    importantForAccessibilityOverride?: string;
    onFocusSink?: () => void;
}
export declare class FocusManager extends FocusManagerBase {
    constructor(parent: FocusManager | undefined);
    protected addFocusListenerOnComponent(component: FocusableComponentInternal, onFocus: () => void): void;
    protected removeFocusListenerFromComponent(component: FocusableComponentInternal, onFocus: () => void): void;
    protected focusComponent(component: FocusableComponentInternal): boolean;
    private static _focusFirst;
    protected resetFocus(focusFirstWhenNavigatingWithKeyboard: boolean): void;
    protected _updateComponentFocusRestriction(storedComponent: StoredFocusableComponent): void;
    private static _updateComponentTabIndexAndIFAOverrides;
}
export declare function applyFocusableComponentMixin(Component: any, isConditionallyFocusable?: Function, accessibleOnly?: boolean): void;
export default FocusManager;
