import * as fs from "fs-extra";
import { resolve, join } from "path";
import args from "./args";
import { reroutePathsInDatabaseFile } from "./reroute";

const staticFiles = [
  "actors.db",
  "actor_references.db",
  "custom_fields.db",
  "labelled_items.db",
  "labels.db",
  "markers.db",
  "movie_scenes.db",
  "movies.db",
  "processing.db",
  "scene_views.db",
  "studios.db",
];

const folders = ["images", "previews", "thumbnails"];

function terminateOnMissingFolder(path: string) {
  const resolved = resolve(path);
  console.log(`Checking if ${resolved} exists`);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
    console.warn(`Folder "${resolved}" is missing.`);
    process.exit(1);
  }
}

function moveFile(from: string, to: string) {
  console.log(`Moving ${from} -> ${to}`);
  fs.moveSync(from, to);
}

function copy(from: string, to: string) {
  console.log(`Copying ${from} -> ${to}`);
  fs.copySync(from, to);
}

function fileInOldLibrary(file: string) {
  return join(args.input, file);
}

function fileInNewLibrary(file: string) {
  return join(args.output, "library", file);
}

async function main() {
  terminateOnMissingFolder(args.input);
  terminateOnMissingFolder(args.output);

  const newLibraryFolderToCreate = fileInNewLibrary("");

  if (args.commit) {
    if (fs.existsSync(newLibraryFolderToCreate)) {
      if (!fs.statSync(newLibraryFolderToCreate).isDirectory()) {
        console.warn(
          `Folder "${newLibraryFolderToCreate}" should not be a file.`
        );
        process.exit(1);
      }
    } else {
      fs.mkdirSync(newLibraryFolderToCreate);
    }

    const fileOperation = args.move ? moveFile : copy;

    for (const file of staticFiles) {
      fileOperation(fileInOldLibrary(file), fileInNewLibrary(file));
    }

    if (!args.no_folders) {
      for (const folder of folders) {
        fileOperation(fileInOldLibrary(folder), fileInNewLibrary(folder));
      }
    }
  }

  if (!args.debug) {
    await reroutePathsInDatabaseFile(
      fileInOldLibrary("scenes.db"),
      fileInNewLibrary("scenes.db"),
      args.commit
    );
    await reroutePathsInDatabaseFile(
      fileInOldLibrary("images.db"),
      fileInNewLibrary("images.db"),
      args.commit
    );
  }

  if (!args.commit) {
    {
      console.log(
        "\nI would have created the new library at " + newLibraryFolderToCreate
      );

      console.log(`\nI would have ${args.move ? "moved" : "copied"} files:`);
      staticFiles.forEach((file) => {
        console.log(`${fileInOldLibrary(file)} -> ${fileInNewLibrary(file)}`);
      });

      if (!args.no_folders) {
        console.log(
          `\nI would have ${args.move ? "moved" : "copied"} folders:`
        );
        folders.forEach((folder) => {
          console.log(
            `${fileInOldLibrary(folder)} -> ${fileInNewLibrary(folder)}`
          );
        });
      } else console.log("\nI would have ignore folders");

      console.log(
        "\nAlso I would have rerouted all paths for images and scenes"
      );
    }
  }
}

main();
