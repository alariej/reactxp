"use strict";
/*
 * window.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Window module to enable easy mocking.
 */
module.exports = typeof window !== 'undefined' ? window : {};
