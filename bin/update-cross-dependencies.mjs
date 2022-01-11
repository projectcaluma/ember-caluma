"use strict";

/**
 * This script is used for updating all cross dependencies of a package _before_
 * a release. It extracts all (dev)dependencies to `@projectcaluma/ember-*` and
 * checks if there is a newer version than the currently installed available. It
 * also extracts what kind of update it is, if it's a dev dependency, a minor or
 * a patch update, we don't neccessarily need a version bump in the current
 * package. However, if the new version is a major (or premajor) version, we
 * need to declare the update as breaking change and trigger a major release as
 * well.
 */

import fs from "fs";
import { cwd, exit } from "process";

import { execa } from "execa";
import semver from "semver";

const pkgPath = `${cwd()}/package.json`;
const pkg = await import(pkgPath);

// extract dependencies to `@projectcaluma/ember-*` packages that have a newer
// version and their respective "update level" (major, premajor, minor,
// preminor, patch, prepatch, or prerelease)
async function getUpdates(dependencies, dev = false) {
  return await Object.entries(dependencies ?? {})
    .filter(([name]) => name.startsWith("@projectcaluma"))
    .reduce(async (updatesPromise, [name, currentVersion]) => {
      const folderName = name.replace(/@projectcaluma\/ember-/, "");
      const newVersion = (
        await import(`../packages/${folderName}/package.json`)
      ).default.version;
      const range = currentVersion.match(/^(\^|~)/)?.[0] ?? "";

      const currentVersionWithoutRange = currentVersion.replace(range, "");

      const updates = await updatesPromise;
      if (currentVersionWithoutRange !== newVersion) {
        updates[name] = {
          version: `${range}${newVersion}`,
          diff: dev
            ? null
            : semver.diff(currentVersionWithoutRange, newVersion),
        };
      }

      return Promise.resolve(updates);
    }, Promise.resolve({}));
}

const updates = {
  ...(await getUpdates(pkg.default.devDependencies, true)),
  ...(await getUpdates(pkg.default.dependencies)),
};

if (!Object.keys(updates).length) {
  // eslint-disable-next-line no-console
  console.log("No packages updated");
  exit(0);
}

// write updates to package.json
await new Promise((resolve) => {
  fs.readFile(pkgPath, "utf8", (err, data) => {
    const result = Object.entries(updates).reduce(
      (result, [name, { version }]) => {
        return result.replace(
          new RegExp(`"${name}": ".*"`),
          `"${name}": "${version}"`
        );
      },
      data
    );

    fs.writeFile(pkgPath, result, "utf8", resolve);
  });
});

await execa("yarn", ["install"]);

// if there is a major release in the updates, we need to define our update as
// major as well
const isBreaking = Object.values(updates).some(({ diff }) =>
  diff?.endsWith("major")
);

const updateComments = Object.entries(updates)
  .map(([name, { version }]) => `- ${name} to ${version}`)
  .join("\n");

const body = isBreaking
  ? `BREAKING CHANGE:\n\n${updateComments}`
  : updateComments;

const msg = `chore(cross-deps): update cross dependencies\n\n${body}`;

// commit changes as github actions bot
await execa("git", [
  "config",
  "--local",
  "user.email",
  "github-actions[bot]@users.noreply.github.com",
]);
await execa("git", ["config", "--local", "user.name", "github-actions[bot]"]);
await execa("git", ["add", "./package.json", "../../yarn.lock"]);
await execa("git", ["commit", "-m", msg]);
await execa("git", ["push"]);

// eslint-disable-next-line no-console
console.log(`Packages updated with commit message:\n\n${msg}`);
