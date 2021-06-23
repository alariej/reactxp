/**
 * AlertModalContent.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web Alert dialog boxes modal content.
 */
/// <reference types="react" />
import * as RX from '../common/Interfaces';
export interface AppModalContentProps extends RX.Types.ViewProps {
    buttons?: RX.Types.AlertButtonSpec[];
    title: string;
    message?: string;
    modalId: string;
    theme?: RX.Types.AlertModalTheme;
    preventDismissOnPress?: boolean;
}
export interface AppModalContentState {
    hoverIndex: number;
}
export declare class AlertModalContent extends RX.Component<AppModalContentProps, AppModalContentState> {
    constructor(props: AppModalContentProps);
    render(): JSX.Element;
    private _onPressButton;
    private _onPressBody;
    private _onPressBackground;
}
export default AlertModalContent;
