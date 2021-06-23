/**
 * Animated.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Animation abstraction.
 */
import * as RN from 'react-native';
import * as RX from '../common/Interfaces';
export interface AnimatedClasses {
    Image: typeof RN.ReactNativeBaseComponent;
    Text: typeof RN.ReactNativeBaseComponent;
    TextInput: typeof RN.ReactNativeBaseComponent;
    View: typeof RN.ReactNativeBaseComponent;
}
export declare const CommonAnimatedClasses: AnimatedClasses;
export declare const AnimatedCommon: {
    Easing: RX.Types.Animated.Easing;
    timing: (value: RX.Types.AnimatedValue, config: RX.Types.Animated.TimingAnimationConfig) => RX.Types.Animated.CompositeAnimation;
    parallel: typeof RN.Animated.parallel;
    sequence: typeof RN.Animated.sequence;
    Value: typeof RN.Animated.Value;
    createValue: (initialValue: number) => RN.Animated.Value;
    interpolate: (animatedValue: RX.Types.AnimatedValue, inputRange: number[], outputRange: string[]) => RX.Types.InterpolatedValue;
};
export declare function makeAnimated(nativeAnimatedClasses: AnimatedClasses, useFocusRestrictedView?: boolean): RX.Animated;
export default AnimatedCommon;
