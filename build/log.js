"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.debug)
        console.log.apply(console, args);
}
exports.log = log;
