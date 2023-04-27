import fs from "fs";
import process from "process";

import { globSync } from "glob";

const version = process.argv[2];

globSync("**/package.json").forEach((filename) => {
  const content = fs.readFileSync(filename).toString();
  const newContent = content.replace(/("version": ").*(")/, `$1${version}$2`);

  fs.writeFileSync(filename, newContent);
});
