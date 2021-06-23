/**
 * FocusManager.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Manages focusable elements for better keyboard navigation.
 */
import * as React from 'react';
import { Types } from '../../common/Interfaces';
export declare enum RestrictFocusType {
    Unrestricted = 0,
    Restricted = 1,
    RestrictedFocusFirst = 2
}
export interface FocusableInternal {
    focusableComponentId?: string;
}
export declare type FocusableComponentInternal = React.Component<any, any> & FocusableInternal;
export interface StoredFocusableComponent {
    id: string;
    numericId: number;
    component: FocusableComponentInternal;
    onFocus: () => void;
    accessibleOnly: boolean;
    restricted: boolean;
    limitedCount: number;
    limitedCountAccessible: number;
    removed?: boolean;
    callbacks?: FocusableComponentStateCallback[];
}
export declare type FocusableComponentStateCallback = (restrictedOrLimited: boolean) => void;
export declare type FocusManagerRestrictionStateCallback = (restricted: RestrictFocusType) => void;
export declare abstract class FocusManager {
    private static _restrictionStack;
    protected static _currentRestrictionOwner: FocusManager | undefined;
    private static _restoreRestrictionTimer;
    private static _pendingPrevFocusedComponent;
    protected static _currentFocusedComponent: StoredFocusableComponent | undefined;
    protected static _allFocusableComponents: {
        [id: string]: StoredFocusableComponent;
    };
    protected static _skipFocusCheck: boolean;
    protected static _resetFocusTimer: number | undefined;
    private _parent;
    private _isFocusLimited;
    private _currentRestrictType;
    private _prevFocusedComponent;
    protected _myFocusableComponentIds: {
        [id: string]: boolean;
    };
    private _restrictionStateCallback;
    constructor(parent: FocusManager | undefined);
    protected abstract addFocusListenerOnComponent(component: FocusableComponentInternal, onFocus: () => void): void;
    protected abstract removeFocusListenerFromComponent(component: FocusableComponentInternal, onFocus: () => void): void;
    protected abstract focusComponent(component: FocusableComponentInternal): boolean;
    protected abstract resetFocus(focusFirstWhenNavigatingWithKeyboard: boolean): void;
    protected abstract _updateComponentFocusRestriction(storedComponent: StoredFocusableComponent): void;
    addFocusableComponent(component: FocusableComponentInternal, accessibleOnly?: boolean): void;
    removeFocusableComponent(component: FocusableComponentInternal): void;
    restrictFocusWithin(restrictType: RestrictFocusType, noFocusReset?: boolean): void;
    removeFocusRestriction(): void;
    limitFocusWithin(limitType: Types.LimitFocusType): void;
    removeFocusLimitation(): void;
    release(): void;
    static subscribe(component: FocusableComponentInternal, callback: FocusableComponentStateCallback): void;
    static unsubscribe(component: FocusableComponentInternal, callback: FocusableComponentStateCallback): void;
    setRestrictionStateCallback(callback: FocusManagerRestrictionStateCallback | undefined): void;
    static isComponentFocusRestrictedOrLimited(component: FocusableComponentInternal): boolean;
    static getCurrentFocusedComponent(): string | undefined;
    private static _getStoredComponent;
    protected static _callFocusableComponentStateChangeCallbacks(storedComponent: StoredFocusableComponent, restrictedOrLimited: boolean): void;
    private _removeFocusRestriction;
    private static _clearRestoreRestrictionTimeout;
}
export declare function applyFocusableComponentMixin(Component: any, isConditionallyFocusable?: Function, accessibleOnly?: boolean): void;
export default FocusManager;
