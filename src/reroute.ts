import * as fs from "fs-extra";
import readline from "readline";
import { resolve, dirname, relative, join } from "path";

function isInFolderTree(parent: string, dir: string) {
  const path = require("path");
  const relative = path.relative(parent, dir);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

export function reroutePathsInDatabaseFile(
  input: string,
  output: string,
  commit: boolean
) {
  const resolvedInput = resolve(input);
  const resolvedOutput = resolve(output);
  const oldLibraryPath = dirname(input);
  const newLibraryPath = dirname(output);

  const appendLine = (line: string) => {
    fs.appendFileSync(resolvedOutput, line + "\n", "utf8");
  };

  if (!fs.existsSync(resolvedInput)) return;

  console.log("Rerouting " + resolvedInput + " to " + resolvedOutput);

  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(input);
    const rl = readline.createInterface({
      input: readStream,
      output: process.stdout,
      terminal: false,
    });

    rl.on("line", (line) => {
      const item = JSON.parse(line) as { path: string | null };

      if (item.path) {
        if (isInFolderTree(oldLibraryPath, item.path)) {
          const rerouteTo = relative(oldLibraryPath, item.path);
          const newPath = join(newLibraryPath, rerouteTo);
          if (!commit) console.log(`Reroute ${item.path} -> ${newPath}`);
          item.path = newPath;
        }
      }

      if (commit) appendLine(JSON.stringify(item));
    });

    rl.on("close", () => {
      readStream.removeAllListeners();
      readStream.close();
      resolve();
    });
  });
}
