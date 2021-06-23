/**
 * Animated.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Implements animated components for web version of ReactXP.
 */
import Easing from '../common/Easing';
import * as RX from '../common/Interfaces';
export declare abstract class Animation {
    _id: number | undefined;
    abstract start(onEnd?: RX.Types.Animated.EndCallback): void;
    abstract stop(): void;
}
interface ValueListener {
    setValue(valueObject: Value, newValue: number | string): void;
    startTransition(valueObject: Value, from: number | string, toValue: number | string, duration: number, easing: string, delay: number, onEnd: RX.Types.Animated.EndCallback): void;
    stopTransition(valueObject: Value): number | string | undefined;
}
export declare class Value extends RX.Types.AnimatedValue {
    protected _value: number | string;
    private _listeners;
    constructor(value: number);
    _getInputValue(): number | string;
    _getOutputValue(): number | string;
    _getInterpolatedValue(inputVal: number | string): number | string;
    _isInterpolated(): boolean;
    interpolate(config: RX.Types.Animated.InterpolationConfigType): InterpolatedValue;
    setValue(value: number | string): void;
    _addListener(listenerToAdd: ValueListener): void;
    _removeListener(listenerToRemove: ValueListener): void;
    _removeAllListeners(): void;
    _startTransition(toValue: number | string, duration: number, easing: string, delay: number, onEnd: RX.Types.Animated.EndCallback): void;
    _stopTransition(): void;
    _updateFinalValue(value: number | string): void;
}
export declare class InterpolatedValue extends Value {
    private _config;
    private _interpolationConfig;
    constructor(_config: RX.Types.Animated.InterpolationConfigType, rootValue: Value);
    _startTransition(toValue: number | string, duration: number, easing: string, delay: number, onEnd: RX.Types.Animated.EndCallback): void;
    _convertValueToNumeric(inputVal: number | string): number;
    _addUnitsToNumericValue(value: number, templateValue: number | string): number | string;
    _getInterpolatedValue(inputVal: number | string): number | string;
    _isInterpolated(): boolean;
}
export declare const timing: RX.Types.Animated.TimingFunction;
export declare const sequence: RX.Types.Animated.SequenceFunction;
export declare const parallel: RX.Types.Animated.ParallelFunction;
export declare const Image: typeof RX.AnimatedImage;
export declare const Text: typeof RX.AnimatedText;
export declare const TextInput: typeof RX.AnimatedTextInput;
export declare const View: typeof RX.AnimatedView;
export declare type Image = RX.AnimatedImage;
export declare type Text = RX.AnimatedText;
export declare type TextInput = RX.AnimatedTextInput;
export declare type View = RX.AnimatedView;
export declare const createValue: (initialValue: number) => Value;
export declare const interpolate: (value: Value, inputRange: number[], outputRange: string[]) => Value;
export { Easing };
