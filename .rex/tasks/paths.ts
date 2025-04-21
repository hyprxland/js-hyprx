import { join, dirname, fromFileUrl } from 'jsr:@std/path@1'
import { resolve } from 'node:path';

const dir = import.meta.dirname ?? (dirname(fromFileUrl(import.meta.url)));
export const projectRootDir = resolve(dir, '..', '..');
export const tasksDir = join(projectRootDir, 'tasks'); 
export const jsrDir = join(projectRootDir, 'jsr');
export const npmDir = join(projectRootDir, 'npm');
export const rexDir = join(projectRootDir, '.rex');
export const buildConfigPath = join(rexDir, 'config.json');
export const gitDir = join(projectRootDir, '.git');
