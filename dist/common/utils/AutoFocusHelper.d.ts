/**
 * AutoFocusHelper.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Provides the functions which allow to handle the selection of a proper component
 * to focus from the multiple candidates with autoFocus=true.
 */
import * as React from 'react';
import * as RX from '../Interfaces';
export declare enum FocusCandidateType {
    Focus = 1,
    FocusFirst = 2
}
export interface FocusCandidateInternal {
    component: React.Component<any, any>;
    focus: () => void;
    isAvailable: () => boolean;
    type: FocusCandidateType;
    accessibilityId?: string;
}
export declare type SortAndFilterFunc = (candidates: FocusCandidateInternal[]) => FocusCandidateInternal[];
export declare function setSortAndFilterFunc(sortAndFilter: SortAndFilterFunc): void;
export declare class FocusArbitratorProvider {
    private _id;
    private _parentArbitratorProvider;
    private _arbitratorCallback;
    private _candidates;
    private _pendingChildren;
    constructor(view?: RX.View, arbitrator?: RX.Types.FocusArbitrator);
    private _notifyParent;
    private _arbitrate;
    private _requestFocus;
    private static _arbitrate;
    setCallback(arbitrator?: RX.Types.FocusArbitrator): void;
    static requestFocus(component: React.Component<any, any>, focus: () => void, isAvailable: () => boolean, type?: FocusCandidateType): void;
}
