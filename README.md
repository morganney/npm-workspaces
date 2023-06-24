# NPM Workspaces Example

Find best way to create a build artifact from the production dependencies for only one workspace in the monorepo. Ideally, the installed dependencies are only in one `node_modules` directory, and located at the repo root.

Inspired by this SO question: https://stackoverflow.com/questions/70540116/how-do-i-install-dependencies-for-a-single-package-when-using-npm-workspaces/76376644#76376644


### Examples:

* Remove `node_modules` from all locations:
  * `npm run clean`
* Produce production dependencies for only one workspace inside of the `dist` directory:
  * `node build.js <pkg name>`, for example `node build.js foo`.
* Alternative approach by moving `package-lock.json` and `package.json` files:
  * `node prepare.js <pkg name>`, for example `node prepare.js foo`. This effectively bypasses the npm tooling for workspaces.

### Notes

* npm >= 9.7.2 is necessary to correctly use `--omit=dev` with workspaces.
  * @see https://github.com/npm/cli/issues/6441
* `--install-strategy=nested` does not appear to work correctly with any npm version using workspaces.
