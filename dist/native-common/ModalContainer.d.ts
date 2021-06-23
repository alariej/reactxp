/**
 * ModalContainer.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Modal abstraction.
 */
import * as React from 'react';
import { Types } from '../common/Interfaces';
export interface ModalContainerProps extends Types.CommonProps<ModalContainer> {
    hidden?: boolean;
}
export declare class ModalContainer extends React.Component<ModalContainerProps, Types.Stateless> {
    constructor(props: ModalContainerProps);
    render(): JSX.Element;
}
export default ModalContainer;
