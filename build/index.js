"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var path_1 = require("path");
var args_1 = __importDefault(require("./args"));
var reroute_1 = require("./reroute");
var staticFiles = [
    "actors.db",
    "cross_references.db",
    "custom_fields.db",
    "labels.db",
    "markers.db",
    "movies.db",
    "queue.db",
    "studios.db",
];
var folders = ["images", "previews", "thumbnails"];
function terminateOnMissingFolder(path) {
    var resolved = path_1.resolve(path);
    console.log("Checking if " + resolved + " exists");
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
        console.warn("Folder \"" + resolved + "\" is missing.");
        process.exit(1);
    }
}
function moveFile(from, to) {
    console.log("Moving " + from + " -> " + to);
    fs.moveSync(from, to);
}
function copy(from, to) {
    console.log("Copying " + from + " -> " + to);
    fs.copySync(from, to);
}
function fileInOldLibrary(file) {
    return path_1.join(args_1.default.input, file);
}
function fileInNewLibrary(file) {
    return path_1.join(args_1.default.output, "library", file);
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var newLibraryFolderToCreate, fileOperation, _i, staticFiles_1, file, _a, folders_1, folder;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    terminateOnMissingFolder(args_1.default.input);
                    terminateOnMissingFolder(args_1.default.output);
                    newLibraryFolderToCreate = fileInNewLibrary("");
                    if (args_1.default.commit) {
                        if (fs.existsSync(newLibraryFolderToCreate)) {
                            if (!fs.statSync(newLibraryFolderToCreate).isDirectory()) {
                                console.warn("Folder \"" + newLibraryFolderToCreate + "\" should not be a file.");
                                process.exit(1);
                            }
                        }
                        else {
                            fs.mkdirSync(newLibraryFolderToCreate);
                        }
                        fileOperation = args_1.default.move ? moveFile : copy;
                        for (_i = 0, staticFiles_1 = staticFiles; _i < staticFiles_1.length; _i++) {
                            file = staticFiles_1[_i];
                            fileOperation(fileInOldLibrary(file), fileInNewLibrary(file));
                        }
                        if (!args_1.default.no_folders) {
                            for (_a = 0, folders_1 = folders; _a < folders_1.length; _a++) {
                                folder = folders_1[_a];
                                fileOperation(fileInOldLibrary(folder), fileInNewLibrary(folder));
                            }
                        }
                    }
                    if (!args_1.default.debug) return [3 /*break*/, 3];
                    return [4 /*yield*/, reroute_1.reroutePathsInDatabaseFile(fileInOldLibrary("scenes.db"), fileInNewLibrary("scenes.db"), args_1.default.commit)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, reroute_1.reroutePathsInDatabaseFile(fileInOldLibrary("images.db"), fileInNewLibrary("images.db"), args_1.default.commit)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    if (!args_1.default.commit) {
                        {
                            console.log("\nI would have created the new library at " + newLibraryFolderToCreate);
                            console.log("\nI would have " + (args_1.default.move ? "moved" : "copied") + " files:");
                            staticFiles.forEach(function (file) {
                                console.log(fileInOldLibrary(file) + " -> " + fileInNewLibrary(file));
                            });
                            if (!args_1.default.no_folders) {
                                console.log("\nI would have " + (args_1.default.move ? "moved" : "copied") + " folders:");
                                folders.forEach(function (folder) {
                                    console.log(fileInOldLibrary(folder) + " -> " + fileInNewLibrary(folder));
                                });
                            }
                            else
                                console.log("\nI would have ignore folders");
                            console.log("\nAlso I would have rerouted all paths for images and scenes");
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main();
