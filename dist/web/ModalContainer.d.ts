/**
 * ModalContainer.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of a view that's used to render modals.
 */
import * as React from 'react';
import { Types } from '../common/Interfaces';
export declare class ModalContainer extends React.Component<Types.CommonProps<ModalContainer>, Types.Stateless> {
    constructor(props: Types.CommonProps<ModalContainer>);
    render(): JSX.Element;
}
export default ModalContainer;
