/**
 * executeTransition.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Provides a convenient API for applying a CSS transition to a DOM element and
 * notifying when the transition is complete.
 */
export interface TransitionSpec {
    property: string;
    duration: number;
    timing?: string;
    delay?: number;
    from: any;
    to: any;
}
export declare function executeTransition(element: HTMLElement, transitions: TransitionSpec[], done: () => void): void;
export default executeTransition;
