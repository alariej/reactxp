/**
 * MonitorListEdits.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Looks for insertions, removals, and moves each time the component receives new
 * children. Communicates these list edits to the consumer giving it the opportunity
 * to animate the edits.
 */
import * as React from 'react';
import { Types } from '../../common/Interfaces';
export interface AddEdit {
    element: React.Component<any, any> | Element;
}
export interface MoveEdit {
    element: React.Component<any, any> | Element;
    leftDelta: number;
    topDelta: number;
}
export interface RemoveEdit {
    element: React.Component<any, any> | Element;
    leftDelta: number;
    topDelta: number;
}
export interface Edits {
    added: AddEdit[];
    moved: MoveEdit[];
    removed: RemoveEdit[];
}
export interface MonitorListEditsProps extends React.HTMLAttributes<any> {
    componentWillAnimate?: (edits: Edits, done: () => void) => void;
    testId?: string;
    children: React.ReactNode;
}
export declare class MonitorListEdits extends React.Component<MonitorListEditsProps, Types.Stateless> {
    private _itemRefs;
    private _refReplacementCache;
    private _isMounted;
    private _childrenKeys;
    private _childrenMap;
    private _childrenToRender;
    private _phase;
    private _willAnimatePhaseInfo;
    UNSAFE_componentWillMount(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    shouldComponentUpdate(): boolean;
    UNSAFE_componentWillUpdate(nextProps: MonitorListEditsProps): void;
    render(): JSX.Element;
    componentDidUpdate(prevProps: MonitorListEditsProps): void;
    private _saveRef;
}
