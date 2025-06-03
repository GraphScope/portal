// src/utils/paths.esm.ts
// This file will be used for ESM builds only

import { dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';

// In ESM, we must compute these from import.meta.url
// @ts-ignore: TS1343 (import.meta is only allowed under ESM‐modules)
const url = import.meta.url;
export const filename = fileURLToPath(url);
export const dirname = pathDirname(filename);