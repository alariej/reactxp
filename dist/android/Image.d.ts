/**
 * Image.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Android-specific implementation of Image component.
 */
import * as RN from 'react-native';
import { Image as CommonImage } from '../native-common/Image';
export declare class Image extends CommonImage {
    protected _getAdditionalProps(): RN.ImagePropertiesAndroid;
}
export default Image;
