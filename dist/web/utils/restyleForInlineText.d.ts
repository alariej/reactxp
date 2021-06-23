/**
 * restyleForInlineText.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * When a ReactXP component appears as a child of an RX.Text, it needs to be styled
 * specially so that it appears inline with the text rather than introducing line
 * breaks.
 *
 * This utility restyles the component that is passed to it as inline so it flows
 * with the text. When a ReactXP component is a child of a text, pass the return value
 * of its render method to this utility. See RX.View for an example.
 */
import * as React from 'react';
declare function restyleForInlineText(reactElement: React.ReactElement<any>): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
export default restyleForInlineText;
