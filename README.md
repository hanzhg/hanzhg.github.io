## hanzhang.ca
Personal website made with React, HTML, CSS, JS

### Run:

  1. `npm install`
  2. `npm run start`

### Build & Deploy:

  1. `npm run build`
  2. `npm run deploy`

### Update Dependencies:

To update Node.js, npm, and all project packages to their latest versions:

  1. Install the latest Node.js LTS release. npm's latest release may require a newer Node.js version.
  2. Update npm with `npm install --global npm@latest`.
  3. Update dependency version ranges, including major versions, with `npx npm-check-updates -u`.
  4. Install the updated packages and refresh the lockfile with `npm install`.
  5. Verify with `npm run lint` and `npm run build`, and review any required code changes before deploying.

Major package updates can introduce breaking changes, so review their release notes and the `package.json` diff before committing.