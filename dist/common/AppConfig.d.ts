/**
 * AppConfig.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * A simple class to store application config.
 */
export declare class AppConfig {
    private _isDebug;
    private _isDevelopment;
    setAppConfig(isDebug: boolean, isDevelopment: boolean): void;
    isDebugMode(): boolean;
    isDevelopmentMode(): boolean;
}
declare const _default: AppConfig;
export default _default;
