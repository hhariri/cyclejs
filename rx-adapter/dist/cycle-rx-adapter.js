(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var rx_1 = typeof window !== "undefined" ? window['Rx'] : typeof global !== "undefined" ? global['Rx'] : null;
function logToConsoleError(err) {
    var target = err.stack || err;
    if (console && console.error) {
        console.error(target);
    } else if (console && console.log) {
        console.log(target);
    }
}
var RxJSAdapter = {
    adapt: function adapt(originStream, originStreamSubscribe) {
        if (this.isValidStream(originStream)) {
            return originStream;
        }
        return rx_1.Observable.create(function (destinationObserver) {
            var originObserver = {
                next: function next(x) {
                    return destinationObserver.onNext(x);
                },
                error: function error(e) {
                    return destinationObserver.onError(e);
                },
                complete: function complete() {
                    return destinationObserver.onCompleted();
                }
            };
            var dispose = originStreamSubscribe(originStream, originObserver);
            return function () {
                if (typeof dispose === 'function') {
                    dispose.call(null);
                }
            };
        });
    },
    dispose: function dispose(sinks, sinkProxies, sources) {
        Object.keys(sources).forEach(function (k) {
            if (typeof sources[k].dispose === 'function') {
                sources[k].dispose();
            }
        });
        Object.keys(sinkProxies).forEach(function (k) {
            sinkProxies[k].observer.complete();
        });
    },
    makeHoldSubject: function makeHoldSubject() {
        var stream = new rx_1.ReplaySubject(1);
        var observer = {
            next: function next(x) {
                stream.onNext(x);
            },
            error: function error(err) {
                logToConsoleError(err);
                stream.onError(err);
            },
            complete: function complete(x) {
                stream.onCompleted();
            }
        };
        return { stream: stream, observer: observer };
    },
    isValidStream: function isValidStream(stream) {
        return typeof stream.subscribeOnNext === 'function' && typeof stream.onValue !== 'function';
    },
    streamSubscribe: function streamSubscribe(stream, observer) {
        var subscription = stream.subscribe(function (x) {
            return observer.next(x);
        }, function (e) {
            return observer.error(e);
        }, function () {
            return observer.complete();
        });
        return function () {
            subscription.dispose();
        };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RxJSAdapter;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
