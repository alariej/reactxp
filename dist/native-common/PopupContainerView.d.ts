/**
 * PopupContainerView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * The view containing the Popup to show. This view does its own position
 * calculation on rendering as directed by position instructions received
 * through properties.
 */
/// <reference types="react" />
import * as RN from 'react-native';
import { Types } from '../common/Interfaces';
import { PopupContainerViewBase, PopupContainerViewBaseProps, PopupContainerViewContext, RecalcResult } from '../common/PopupContainerViewBase';
export interface PopupContainerViewProps extends PopupContainerViewBaseProps<PopupContainerView> {
    popupOptions: Types.PopupOptions;
    anchorHandle?: number;
    onDismissPopup?: () => void;
}
export interface PopupContainerViewState extends RecalcResult {
    isMeasuringPopup: boolean;
    popupWidth: number;
    popupHeight: number;
}
export declare class PopupContainerView extends PopupContainerViewBase<PopupContainerViewProps, PopupContainerViewState, PopupContainerView> {
    private _mountedComponent;
    private _viewHandle;
    private _respositionPopupTimer;
    constructor(props: PopupContainerViewProps, context?: PopupContainerViewContext);
    private _getInitialState;
    UNSAFE_componentWillReceiveProps(prevProps: PopupContainerViewProps): void;
    componentDidUpdate(prevProps: PopupContainerViewProps, prevState: PopupContainerViewState): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    protected _onMount: (component: RN.View | null) => void;
    private _recalcPosition;
    private _recalcPositionFromLayoutData;
    private _dismissPopup;
    private _startRepositionPopupTimer;
    private _stopRepositionPopupTimer;
}
export default PopupContainerView;
