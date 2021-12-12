import fs from 'fs';

import { walkTree } from './fileTree';
import { Logger } from './options/logger';
import { Directory } from './interfaces/directory.interface';
import { FileTreeLocation } from './interfaces/location.interface';

export function purge(rootTree: Directory, shouldPurge: boolean, barrelName: string, logger: Logger) {
  // Delete any existing barrels.
  if (shouldPurge) {
    logger.debug(`Purging barrels for ${rootTree}`);
    walkTree(rootTree, (directory: Directory) => {
      directory.files
        .filter((file: FileTreeLocation) => {
          return file.name === barrelName;
        })
        .forEach((file: FileTreeLocation) => {
          logger.debug(`Deleting existing barrel @ ${file.path}`);
          // Delete barrel file and clean up tree model.
          fs.unlinkSync(file.path);
          directory.files.splice(directory.files.indexOf(file), 1);
          directory.barrel = undefined;
        });
    });
  }
}
