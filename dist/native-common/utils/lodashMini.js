"use strict";
/**
 * lodashMini.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Import and re-export of part of the lodash module. This helps reduce bundle size.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.union = exports.omit = exports.max = exports.map = exports.last = exports.isUndefined = exports.isEqual = exports.findLast = exports.findIndex = exports.filter = exports.extend = exports.compact = exports.clone = void 0;
var clone = require("lodash/clone");
exports.clone = clone;
var compact = require("lodash/compact");
exports.compact = compact;
var extend = require("lodash/extend");
exports.extend = extend;
var filter = require("lodash/filter");
exports.filter = filter;
var findIndex = require("lodash/findIndex");
exports.findIndex = findIndex;
var findLast = require("lodash/findLast");
exports.findLast = findLast;
var isEqual = require("lodash/isEqual");
exports.isEqual = isEqual;
var isUndefined = require("lodash/isUndefined");
exports.isUndefined = isUndefined;
var last = require("lodash/last");
exports.last = last;
var map = require("lodash/map");
exports.map = map;
var max = require("lodash/max");
exports.max = max;
var omit = require("lodash/omit");
exports.omit = omit;
var union = require("lodash/union");
exports.union = union;
