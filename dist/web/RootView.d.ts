/**
 * RootView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * The top-most view (rendered into window.body) that's used for proper
 * layering or modals, etc. in the web implementation of the ReactXP
 * cross-platform library.
 */
import * as React from 'react';
import { Types } from '../common/Interfaces';
import { RecalcResult } from '../common/PopupContainerViewBase';
import FocusManager from './utils/FocusManager';
import PopupContainerView from './PopupContainerView';
export declare class PopupDescriptor {
    popupId: string;
    popupOptions: Types.PopupOptions;
    constructor(popupId: string, popupOptions: Types.PopupOptions);
}
export interface RootViewProps extends Types.CommonProps<RootView> {
    mainView?: React.ReactNode;
    modal?: React.ReactElement<Types.ViewProps>;
    activePopup?: PopupDescriptor;
    cachedPopup?: PopupDescriptor[];
    autoDismiss?: boolean;
    autoDismissDelay?: number;
    onDismissPopup?: () => void;
    keyBoardFocusOutline?: string;
    mouseFocusOutline?: string;
    writingDirection?: 'auto' | 'rtl' | 'ltr';
}
export interface RootViewState extends RecalcResult {
    isMeasuringPopup: boolean;
    popupWidth: number;
    popupHeight: number;
    focusClass: string | undefined;
}
export interface MainViewContext {
    isInRxMainView?: boolean;
}
export declare class MainViewContainer extends React.Component<Types.CommonProps<MainViewContainer>, Types.Stateless> implements React.ChildContextProvider<MainViewContext> {
    static childContextTypes: React.ValidationMap<any>;
    getChildContext(): MainViewContext;
    render(): ((string | number | boolean | {} | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactNodeArray | React.ReactPortal | React.ReactNode[]) & (boolean | React.ReactChild | React.ReactFragment | React.ReactPortal)) | null | undefined;
}
export declare class RootView extends React.Component<RootViewProps, RootViewState> {
    static childContextTypes: React.ValidationMap<any>;
    private _mountedComponent;
    private _hidePopupTimer;
    private _respositionPopupTimer;
    private _clickHandlerInstalled;
    private _keyboardHandlerInstalled;
    private _focusManager;
    private _isNavigatingWithKeyboardUpateTimer;
    private _shouldEnableKeyboardNavigationModeOnFocus;
    private _applicationIsNotActive;
    private _applicationIsNotActiveTimer;
    private _prevFocusedElement;
    private _updateKeyboardNavigationModeOnFocusTimer;
    constructor(props: RootViewProps);
    getChildContext(): {
        focusManager: FocusManager;
    };
    private _getInitialState;
    UNSAFE_componentWillReceiveProps(prevProps: RootViewProps): void;
    componentDidUpdate(prevProps: RootViewProps, prevState: RootViewState): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private _renderPopup;
    render(): JSX.Element;
    protected _onMount: (component: PopupContainerView | null) => void;
    private _tryClosePopup;
    private _determineIfClickOnElement;
    private _onMouseDownCapture;
    private _onKeyDownCapture;
    private _onFocusIn;
    private _onFocusOut;
    private _requestApplicationIsNotActive;
    private _cancelApplicationIsNotActive;
    private _updateKeyboardNavigationState;
    private _onKeyDown;
    private _onKeyUp;
    private _onMouseEnter;
    private _onMouseLeave;
    private _startHidePopupTimer;
    private _stopHidePopupTimer;
    private _dismissPopup;
    private _startRepositionPopupTimer;
    private _stopRepositionPopupTimer;
    private _recalcPosition;
}
export default RootView;
