# Upgrading Zone.js

`nativescript-angular` uses a fork of the `zone.js` package in order to work around incompatibilities between node, browser, and mobile implementations.

The fork resides at <https://github.com/NativeScript/zone.js> in the `zone-nativescript` branch. It adds a separate `lib/nativescript/nativescript.ts` entry point that is used to generate a new bundle: `dist/zone-nativescript.js`.

To upgrade to a newer release of `zone.js`:

1. Identify the upgrade target -- most likely a release tag.
1. Rebase the `zone-nativescript` branch on top of the upgrade target.
1. Rebuild: `gulp build`
1. Run the node-based smoke tests: `gulp test/nativescript`
1. Run the browser tests: `node_modules/.bin/karma start karma.conf.js --single-run` (You need to run node `test/ws-server.js` in a separate console first)
1. Commit `dist/zone-nativescript.js`, drop the previous `dist/zone-nativescript.js` commit from the branch. Force push the new `zone-nativescript` branch to GitHub.
1. Update your copy of `nativescript-angular/zone.js/dist/zone-nativescript.js` with the bundle you just built.
