"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs-extra"));
var readline_1 = __importDefault(require("readline"));
var path_1 = require("path");
function isInFolderTree(parent, dir) {
    var path = require("path");
    var relative = path.relative(parent, dir);
    return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}
function reroutePathsInDatabaseFile(input, output, commit) {
    var resolvedInput = path_1.resolve(input);
    var resolvedOutput = path_1.resolve(output);
    var oldLibraryPath = path_1.dirname(input);
    var newLibraryPath = path_1.dirname(output);
    var appendLine = function (line) {
        fs.appendFileSync(resolvedOutput, line + "\n", "utf8");
    };
    if (!fs.existsSync(resolvedInput))
        return;
    console.log("Rerouting " + resolvedInput + " to " + resolvedOutput);
    return new Promise(function (resolve, reject) {
        var readStream = fs.createReadStream(input);
        var rl = readline_1.default.createInterface({
            input: readStream,
            output: process.stdout,
            terminal: false,
        });
        rl.on("line", function (line) {
            var item = JSON.parse(line);
            if (item.path) {
                if (isInFolderTree(oldLibraryPath, item.path)) {
                    var rerouteTo = path_1.relative(oldLibraryPath, item.path);
                    var newPath = path_1.join(newLibraryPath, rerouteTo);
                    if (!commit)
                        console.log("Reroute " + item.path + " -> " + newPath);
                    item.path = newPath;
                }
            }
            if (commit)
                appendLine(JSON.stringify(item));
        });
        rl.on("close", function () {
            readStream.removeAllListeners();
            readStream.close();
            resolve();
        });
    });
}
exports.reroutePathsInDatabaseFile = reroutePathsInDatabaseFile;
