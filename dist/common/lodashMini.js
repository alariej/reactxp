"use strict";
/**
 * lodashMini.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Imports a subset of lodash library needed for ReactXP's implementation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortBy = exports.pull = exports.isEqual = exports.filter = exports.compact = exports.clone = void 0;
var clone = require("lodash/clone");
exports.clone = clone;
var compact = require("lodash/compact");
exports.compact = compact;
var filter = require("lodash/filter");
exports.filter = filter;
var isEqual = require("lodash/isEqual");
exports.isEqual = isEqual;
var pull = require("lodash/pull");
exports.pull = pull;
var sortBy = require("lodash/sortBy");
exports.sortBy = sortBy;
