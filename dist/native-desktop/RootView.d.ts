/**
 * RootView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * The top-most view that's used for proper layering or modals and popups.
 */
import * as React from 'react';
import * as RN from 'react-native';
import { BaseRootView, BaseRootViewProps, RootView as RootViewBase, RootViewPropsWithMainViewType, RootViewState, RootViewUsingProps as RootViewUsingPropsBase } from '../native-common/RootView';
import FocusManager from './utils/FocusManager';
declare const RootViewUsingStore: {
    new (...args: any[]): {
        _focusManager: FocusManager;
        _keyboardHandlerInstalled: boolean;
        _isNavigatingWithKeyboardUpateTimer: number | undefined;
        _onTouchStartCapture: (e: RN.NativeSyntheticEvent<any>) => void;
        _onKeyDownCapture: (e: RN.NativeSyntheticEvent<any>) => void;
        _updateKeyboardNavigationState(isNavigatingWithKeyboard: boolean): void;
        _onKeyDown: (e: RN.NativeSyntheticEvent<any>) => void;
        _onKeyPress: (e: RN.NativeSyntheticEvent<any>) => void;
        _onKeyUp: (e: RN.NativeSyntheticEvent<any>) => void;
        getChildContext(): {
            focusManager: FocusManager;
        };
        renderTopView(content: JSX.Element): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<{}>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        render(): React.ReactNode;
        readonly props: Readonly<{}> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void;
    };
    childContextTypes: React.ValidationMap<any>;
} & typeof RootViewBase;
declare const RootViewUsingProps: {
    new (...args: any[]): {
        _focusManager: FocusManager;
        _keyboardHandlerInstalled: boolean;
        _isNavigatingWithKeyboardUpateTimer: number | undefined;
        _onTouchStartCapture: (e: RN.NativeSyntheticEvent<any>) => void;
        _onKeyDownCapture: (e: RN.NativeSyntheticEvent<any>) => void;
        _updateKeyboardNavigationState(isNavigatingWithKeyboard: boolean): void;
        _onKeyDown: (e: RN.NativeSyntheticEvent<any>) => void;
        _onKeyPress: (e: RN.NativeSyntheticEvent<any>) => void;
        _onKeyUp: (e: RN.NativeSyntheticEvent<any>) => void;
        getChildContext(): {
            focusManager: FocusManager;
        };
        renderTopView(content: JSX.Element): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<{}>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        render(): React.ReactNode;
        readonly props: Readonly<{}> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void;
    };
    childContextTypes: React.ValidationMap<any>;
} & typeof RootViewUsingPropsBase;
export { BaseRootViewProps, RootViewPropsWithMainViewType, RootViewState, BaseRootView, RootViewUsingStore as RootView, RootViewUsingProps, };
export default RootViewUsingStore;
