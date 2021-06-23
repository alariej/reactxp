"use strict";
/**
 * executeTransition.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Provides a convenient API for applying a CSS transition to a DOM element and
 * notifying when the transition is complete.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeTransition = void 0;
var Timers_1 = require("../../common/utils/Timers");
var _ = require("./../utils/lodashMini");
// Convenient API for applying a CSS transition to a DOM element. Calls `done` when the transition is completed.
function executeTransition(element, transitions, done) {
    var longestDurationPlusDelay = 0;
    var longestDurationProperty = '';
    var cssTransitions = [];
    _.each(transitions, function (transition) {
        var property = transition.property;
        var duration = transition.duration;
        var timing = transition.timing === undefined ? 'linear' : transition.timing;
        var delay = transition.delay === undefined ? 0 : transition.delay;
        var from = transition.from;
        if (duration + delay > longestDurationPlusDelay) {
            longestDurationPlusDelay = duration + delay;
            longestDurationProperty = property;
        }
        // Initial state
        element.style[property] = from;
        // Resolve styles. This is a trick to force the browser to refresh the
        // computed styles. Without this, it won't pick up the new "from" value
        // that we just set above.
        // eslint-disable-next-line no-unused-expressions
        getComputedStyle(element).opacity;
        // TODO: Cross-browser equivalent of 'transition' style (e.g. vendor prefixed).
        cssTransitions.push(property + ' ' + duration + 'ms ' + timing + ' ' + delay + 'ms');
    });
    element.style.transition = cssTransitions.join(', ');
    // eslint-disable-next-line prefer-const
    var finish;
    var onTransitionEnd = function (ev) {
        if (ev.target === element && ev.propertyName === longestDurationProperty) {
            finish();
        }
    };
    // TODO: Cross-browser equivalent of 'transitionEnd' event (e.g. vendor prefixed).
    element.addEventListener('webkitTransitionEnd', onTransitionEnd);
    element.addEventListener('transitionEnd', onTransitionEnd);
    var timeoutId = 0;
    var didFinish = false;
    finish = function () {
        if (!didFinish) {
            Timers_1.default.clearTimeout(timeoutId);
            // Only complete the transition if we are ending the same transition it was initially set.
            // There are cases where transitions may be overriden before the transition ends.
            if (element.dataset.transitionId === timeoutId.toString()) {
                // TODO: Cross-browser equivalent of 'transitionEnd' event (e.g. vendor prefixed).
                element.removeEventListener('webkitTransitionEnd', onTransitionEnd);
                element.removeEventListener('transitionEnd', onTransitionEnd);
                delete element.dataset.transitionId;
                element.style.transition = 'none';
                didFinish = true;
                done();
            }
        }
    };
    // Watchdog timeout for cases where transitionEnd event doesn't fire.
    timeoutId = Timers_1.default.setTimeout(function () {
        // If the item was removed from the DOM (which can happen if a
        // rerender occurred), don't bother finishing. We don't want to do
        // this in the transition event finish path because it's expensive
        // and unnecessary in that case because the transition event
        // implies that the element is still in the DOC
        if (document.body.contains(element)) {
            finish();
        }
    }, longestDurationPlusDelay + 10);
    element.dataset.transitionId = timeoutId.toString();
    // Set the "to" values.
    _.each(transitions, function (transition) {
        var property = transition.property;
        var to = transition.to;
        element.style[property] = to;
    });
}
exports.executeTransition = executeTransition;
exports.default = executeTransition;
