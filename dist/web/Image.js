"use strict";
/**
 * Image.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Image abstraction.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
var PropTypes = require("prop-types");
var React = require("react");
var assert_1 = require("../common/assert");
var Image_1 = require("../common/Image");
var PromiseDefer_1 = require("../common/utils/PromiseDefer");
var _ = require("./utils/lodashMini");
var restyleForInlineText_1 = require("./utils/restyleForInlineText");
var Styles_1 = require("./Styles");
var _styles = {
    image: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        opacity: 0,
        maxWidth: '100%',
        maxHeight: '100%',
    },
    defaultContainer: Styles_1.default.createImageStyle({
        position: 'relative',
        flex: 0,
        overflow: 'visible',
        backgroundColor: 'transparent',
    }),
};
var XhrBlobUrlCache = /** @class */ (function () {
    function XhrBlobUrlCache() {
    }
    XhrBlobUrlCache.get = function (source) {
        if (this._cachedXhrBlobUrls[source]) {
            this._cachedXhrBlobUrls[source].refCount++;
            return this._cachedXhrBlobUrls[source].xhrBlobUrl;
        }
        return undefined;
    };
    XhrBlobUrlCache.insert = function (source, xhrBlobUrl) {
        XhrBlobUrlCache._cleanupIfCapacityExceeded();
        if (this._cachedXhrBlobUrls[source]) {
            XhrBlobUrlCache._cachedXhrBlobUrls[source].refCount++;
        }
        else {
            var xhrBlobUrlCacheEntry = {
                xhrBlobUrl: xhrBlobUrl,
                insertionDate: Date.now(),
                refCount: 1,
            };
            XhrBlobUrlCache._cachedXhrBlobUrls[source] = xhrBlobUrlCacheEntry;
        }
    };
    XhrBlobUrlCache.release = function (source) {
        // Keep track of which cache entries are being used as we don't want to clean up a resource that someone is
        // still relying on.
        if (this._cachedXhrBlobUrls[source]) {
            XhrBlobUrlCache._cachedXhrBlobUrls[source].refCount--;
        }
    };
    XhrBlobUrlCache._cleanupIfCapacityExceeded = function () {
        // If we've reached maximum capacity, clean up the oldest freeable cache entry if any. An entry is freeable is
        // it's not currently in use (refCount == 0). Return whether we have room to add more entries to the cache.
        if (Object.keys(XhrBlobUrlCache._cachedXhrBlobUrls).length + 1 > XhrBlobUrlCache._maximumItems) {
            var oldestFreeableKey_1;
            var oldestFreeableEntry_1;
            Object.keys(XhrBlobUrlCache._cachedXhrBlobUrls).forEach(function (key) {
                if ((!oldestFreeableEntry_1 || XhrBlobUrlCache._cachedXhrBlobUrls[key].insertionDate < oldestFreeableEntry_1.insertionDate) &&
                    XhrBlobUrlCache._cachedXhrBlobUrls[key].refCount === 0) {
                    oldestFreeableKey_1 = key;
                    oldestFreeableEntry_1 = XhrBlobUrlCache._cachedXhrBlobUrls[key];
                }
            });
            if (oldestFreeableKey_1) {
                URL.revokeObjectURL(oldestFreeableEntry_1.xhrBlobUrl);
                delete XhrBlobUrlCache._cachedXhrBlobUrls[oldestFreeableKey_1];
            }
        }
    };
    // Use a global cache to work around the image loading delays introduced by the xhr requests. This is especially
    // visible when scrolling a virtual list view which contains xhr images.
    XhrBlobUrlCache._maximumItems = 128;
    XhrBlobUrlCache._cachedXhrBlobUrls = {};
    return XhrBlobUrlCache;
}());
var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    function Image(props) {
        var _this = _super.call(this, props) || this;
        _this._mountedComponent = null;
        _this._isMounted = false;
        _this._onMount = function (component) {
            _this._mountedComponent = component;
        };
        _this._onLoad = function () {
            if (!_this._isMounted || !_this._mountedComponent) {
                return;
            }
            var imageDOM = _this._mountedComponent;
            // Measure the natural width & height of the image.
            _this._nativeImageWidth = undefined;
            _this._nativeImageHeight = undefined;
            _this._nativeImageWidth = imageDOM.naturalWidth;
            _this._nativeImageHeight = imageDOM.naturalHeight;
            // We can hide the img now. We assume that if the img. URL resolved without error,
            // then the background img. URL also did.
            _this.setState({
                showImgTag: false,
            });
            if (_this.props.onLoad) {
                _this.props.onLoad({ width: _this._nativeImageWidth, height: _this._nativeImageHeight });
            }
        };
        _this._imgOnError = function () {
            _this._onError();
        };
        _this._onMouseUp = function (e) {
            if (e.button === 0) {
                // Types.Image doesn't officially support an onClick prop, but when it's
                // contained within a button, it may have this prop.
                var onClick = _this.props.onClick;
                if (onClick) {
                    onClick(e);
                }
            }
        };
        var performXhrRequest = _this._initializeAndSetState(props, true);
        if (performXhrRequest) {
            _this._startXhrImageFetch(props);
        }
        return _this;
    }
    Image.prototype.getChildContext = function () {
        // Let descendant RX components know that their nearest RX ancestor is not an RX.Text.
        // Because they're in an RX.Image, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        return { isRxParentAText: false };
    };
    Image.prefetch = function (url) {
        var defer = new PromiseDefer_1.Defer();
        var img = new window.Image();
        img.onload = (function (event) {
            defer.resolve(true);
        });
        img.onerror = (function (event) {
            defer.reject('Failed to prefetch url ' + url);
        });
        img.onabort = (function (event) {
            defer.reject('Prefetch cancelled for url ' + url);
        });
        img.src = url;
        return defer.promise();
    };
    Image.getMetadata = function (url) {
        var defer = new PromiseDefer_1.Defer();
        var img = new window.Image();
        img.onload = (function (event) {
            defer.resolve({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
        });
        img.onerror = (function (event) {
            defer.reject('Failed to prefetch url ' + url);
        });
        img.onabort = (function (event) {
            defer.reject('Prefetch cancelled for url ' + url);
        });
        img.src = url;
        return defer.promise();
    };
    Image.prototype.UNSAFE_componentWillReceiveProps = function (nextProps) {
        var sourceOrHeaderChanged = (nextProps.source !== this.props.source ||
            !_.isEqual(nextProps.headers || {}, this.props.headers || {}));
        if (!nextProps.onLoad !== !this.props.onLoad || !nextProps.onError !== !this.props.onError || sourceOrHeaderChanged) {
            var performXhrRequest = this._initializeAndSetState(nextProps, false);
            if (sourceOrHeaderChanged && performXhrRequest) {
                this._startXhrImageFetch(nextProps);
            }
        }
    };
    Image.prototype.componentDidMount = function () {
        this._isMounted = true;
    };
    Image.prototype.componentWillUnmount = function () {
        this._isMounted = false;
        if (this.state.displayUrl && this.state.xhrRequest) {
            XhrBlobUrlCache.release(this.props.source);
        }
    };
    Image.prototype._initializeAndSetState = function (props, initial) {
        // Retrieve the xhr blob url from the cache if it exists. This is a performance optimization as we've seen xhr
        // requests take some time and cause flicker during rendering. Even when we're hitting the browser cache, we've
        // seen it stall and take some time.
        var cachedXhrBlobUrl = props.headers ? XhrBlobUrlCache.get(props.source) : null;
        var displayUrl = cachedXhrBlobUrl ? cachedXhrBlobUrl :
            props.headers ? '' : props.source;
        // Only make the xhr request if headers are specified and there was no cache hit.
        var performXhrRequest = !!props.headers && !cachedXhrBlobUrl;
        // We normally don't show an img tag because we use background images.  However, if the caller has supplied an
        // onLoad or onError callback, we'll use the img tag until we receive an onLoad or onError.  But if we need to
        // perform an XHR first to convert to a blob url, then wait on showing the img tag until we get the blob url
        // since the basic IMG tag will fail to load it without headers.
        var newState = {
            showImgTag: (!performXhrRequest || !!cachedXhrBlobUrl) && (!!props.onLoad || !!props.onError),
            xhrRequest: !!props.headers,
            displayUrl: displayUrl,
        };
        if (initial) {
            this.state = newState;
        }
        else {
            this.setState(newState);
        }
        return performXhrRequest;
    };
    Image.prototype._handleXhrBlob = function (blob) {
        if (!this._isMounted) {
            return;
        }
        var newUrl = URL.createObjectURL(blob);
        // Save the newly fetched xhr blob url in the cache.
        XhrBlobUrlCache.insert(this.props.source, newUrl);
        this.setState({
            displayUrl: newUrl,
            // If we have an onload handler, we need to now load the img tag to get dimensions for the load.
            showImgTag: !!this.props.onLoad,
        });
    };
    Image.prototype._startXhrImageFetch = function (props) {
        // Test hook to simulate a slower hxr request.
        // Timers.setTimeout(() => this._actuallyStartXhrImageFetch(props), 2500);
        this._actuallyStartXhrImageFetch(props);
    };
    Image.prototype._actuallyStartXhrImageFetch = function (props) {
        // Fetch Implementation
        var _this = this;
        // If an 'origin' header is passed, we assume this is intended to be a crossorigin request.
        // In order to send the cookies with the request, the withCredentials: true / credentials: 'include' flag needs to be set.
        var withCredentials = props.headers
            && Object.keys(props.headers).some(function (header) { return header.toLowerCase() === 'origin'; });
        if (typeof (window.fetch) === 'function') {
            var headers_1 = new Headers();
            if (props.headers) {
                Object.keys(props.headers).forEach(function (key) {
                    headers_1.append(key, props.headers[key]);
                });
            }
            var xhr = new Request(props.source, {
                credentials: withCredentials ? 'include' : 'same-origin',
                method: 'GET',
                mode: 'cors',
                headers: headers_1,
            });
            fetch(xhr)
                .then(function (response) {
                if (!response.ok) {
                    _this._onError(new Error(response.statusText));
                }
                return response.blob().then(function (blob) {
                    _this._handleXhrBlob(blob);
                });
            }, function (err) {
                _this._onError(err);
            });
        }
        else {
            var req_1 = new XMLHttpRequest();
            req_1.open('GET', props.source, true);
            if (withCredentials) {
                req_1.withCredentials = true;
            }
            req_1.responseType = 'blob';
            if (props.headers) {
                Object.keys(props.headers).forEach(function (key) {
                    req_1.setRequestHeader(key, props.headers[key]);
                });
            }
            req_1.onload = function () {
                if (req_1.status >= 400 || req_1.status < 600) {
                    _this._onError(new Error(req_1.statusText));
                }
                else {
                    _this._handleXhrBlob(req_1.response);
                }
            };
            req_1.onerror = function () {
                _this._onError(new Error('Network issue downloading the image.'));
            };
            req_1.send();
        }
    };
    Image.prototype.render = function () {
        var source = this.props.source;
        var isSourceValid = !(typeof source !== 'string' && typeof source !== 'undefined');
        // Prepare image source (necessary as iOS implementation also allows objects)
        (0, assert_1.default)(isSourceValid, "Types/web/Image only accepts string sources! You passed: " + source + " of type " + typeof source);
        var optionalImg = null;
        if (this.state.showImgTag) {
            optionalImg = (React.createElement("img", { style: _styles.image, src: this.state.displayUrl, alt: this.props.accessibilityLabel, onError: this._imgOnError, onLoad: this._onLoad, ref: this._onMount }));
        }
        var reactElement = (React.createElement("div", { style: this._getStyles(), title: this.props.title, "data-test-id": this.props.testId, onMouseUp: this._onMouseUp },
            optionalImg,
            this.props.children));
        return this.context.isRxParentAText ?
            (0, restyleForInlineText_1.default)(reactElement) :
            reactElement;
    };
    Image.prototype._getStyles = function () {
        var resizeMode = this.props.resizeMode;
        var styles = (Styles_1.default.combine([_styles.defaultContainer, this.props.style]) || {});
        var backgroundRepeat = resizeMode === 'repeat' ? 'repeat' : 'no-repeat';
        var backgroundSize = this._buildBackgroundSize(resizeMode);
        // It is necessary to wrap the url in quotes as in url("a.jpg?q=(a and b)").
        // If the url is unquoted and contains paranthesis, e.g. a.jpg?q=(a and b), it will become url(a.jpg?q=(a and b))
        // which will not render on the screen.
        var backgroundImage = "url(\"" + this.state.displayUrl + "\")";
        // Types doesn't support border styles other than "solid" for images.
        var borderStyle = styles.borderWidth ? 'solid' : 'none';
        return __assign(__assign({}, styles), { backgroundPosition: 'center center', backgroundRepeat: backgroundRepeat, backgroundImage: backgroundImage, backgroundSize: backgroundSize, borderStyle: borderStyle, display: 'flex' });
    };
    Image.prototype._buildBackgroundSize = function (resizeMode) {
        if (resizeMode === void 0) { resizeMode = Image_1.DEFAULT_RESIZE_MODE; }
        switch (resizeMode) {
            case 'repeat':
                return 'auto';
            case 'stretch':
                return '100% 100%';
            // contain | cover | auto are valid BackgroundSize values
            case 'contain':
            case 'cover':
            case 'auto':
                return resizeMode;
            // Prevents unknown resizeMode values
            default:
                return Image_1.DEFAULT_RESIZE_MODE;
        }
    };
    Image.prototype._onError = function (err) {
        if (!this._isMounted) {
            return;
        }
        // We can hide the img now. We assume that if the img. URL failed to resolve,
        // then the background img. URL also did.
        this.setState({
            showImgTag: false,
        });
        if (this.props.onError) {
            this.props.onError(err);
        }
    };
    // Note: This works only if you have an onLoaded handler and wait for the image to load.
    Image.prototype.getNativeWidth = function () {
        return this._nativeImageWidth;
    };
    Image.prototype.getNativeHeight = function () {
        return this._nativeImageHeight;
    };
    Image.contextTypes = {
        isRxParentAText: PropTypes.bool,
    };
    Image.childContextTypes = {
        isRxParentAText: PropTypes.bool.isRequired,
    };
    return Image;
}(React.Component));
exports.Image = Image;
exports.default = Image;
