"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
var args = yargs.version("0.0.1").options({
    move: {
        default: false,
        type: "boolean",
        alias: "mv",
        description: "Move instead of copy",
    },
    commit: {
        default: false,
        type: "boolean",
        alias: "c",
        description: "Commit changes",
    },
    debug: {
        default: false,
        type: "boolean",
        alias: "d",
        description: "Show debug logging",
    },
    input: {
        required: true,
        type: "string",
        alias: "i",
        description: "Library path to move",
    },
    output: {
        required: true,
        type: "string",
        alias: "o",
        description: "Path to move into (library folder will be created in that destination)",
    },
    no_folders: {
        default: false,
        type: "boolean",
        description: "Ignore folders",
    },
}).argv;
exports.default = args;
