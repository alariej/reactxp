/**
 * Link.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Link abstraction.
 */
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import { Types } from '../common/Interfaces';
export interface LinkContext {
    focusArbitrator?: FocusArbitratorProvider;
}
export declare class Link extends React.Component<Types.LinkProps, Types.Stateless> {
    static contextTypes: {
        focusArbitrator: PropTypes.Requireable<any> & PropTypes.Validator<any>;
    };
    context: LinkContext;
    private _mountedAnchor;
    private _longPressTimer;
    render(): JSX.Element;
    componentDidMount(): void;
    requestFocus(): void;
    focus(): void;
    blur(): void;
    private _onMount;
    private _getStyles;
    private _onClick;
    private _onMouseDown;
    private _onMouseUp;
    private _onContextMenu;
}
export default Link;
